import React, { useState } from 'react';
import DxfParser from 'dxf-parser';
import { Upload, FileText, AlertCircle, CheckCircle, X, Loader2, Table } from 'lucide-react';
// Removed import of gebElements, will use parsedData

const DxfFileParser = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    // Reset previous states
    setError(null);
    setSuccess(false);
    setParsedData(null);
    
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file type
    const fileExtension = file.name.toLowerCase().split('.').pop();
    if (fileExtension !== 'dxf') {
      setError('Please select a valid DXF file (.dxf extension required)');
      setSelectedFile(null);
      return;
    }

    // Validate file size (optional - prevent very large files)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setError('File size too large. Please select a file smaller than 50MB.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    // Automatically parse the file after selection
    parseDxfFile(file);
  };

  // Update parseDxfFile to accept a file argument (for auto-parse)
  const parseDxfFile = async (fileArg) => {
    const fileToParse = fileArg || selectedFile;
    if (!fileToParse) {
      setError('Please select a DXF file first');
      return;
    }

    setError(null);
    setSuccess(false);
    setParsedData(null);

    try {
      // Read file content using FileReader
      const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(fileToParse);
      });

      // Parse DXF content using dxf-parser
      const parser = new DxfParser();
      const dxfData = parser.parseSync(fileContent);

      if (!dxfData) {
        throw new Error('Failed to parse DXF file - invalid format or corrupted file');
      }

      setParsedData(dxfData);
      setSuccess(true);
      setError(null);

    } catch (err) {
      console.error('DXF Parsing Error:', err);
      setError(`Parsing failed: ${err.message || 'Unknown error occurred'}`);
      setParsedData(null);
      setSuccess(false);
    }
  };

  const clearAll = () => {
    setSelectedFile(null);
    setParsedData(null);
    setError(null);
    setSuccess(false);
    setExpandedSections({});
    
    // Reset file input
    const fileInput = document.getElementById('dxf-file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const renderDataSection = (title, data, sectionId, isExpandable = true) => {
    if (!data) return null;

    const dataString = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
    const isLarge = dataString.length > 500;
    const isExpanded = expandedSections[sectionId] || false;

    return (
      <div className="border border-gray-300 rounded-lg mb-4">
        <button
          onClick={() => isExpandable && toggleSection(sectionId)}
          className={`w-full px-4 py-3 text-left font-medium text-gray-700 bg-gray-50 rounded-t-lg hover:bg-gray-100 flex justify-between items-center ${!isExpandable ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <span>{title}</span>
          {isExpandable && (
            <span className="text-sm text-gray-500">
              {isExpanded ? 'Click to collapse' : 'Click to expand'}
            </span>
          )}
        </button>
        
        {(!isExpandable || isExpanded) && (
          <div className="p-4 bg-white rounded-b-lg">
            <pre className={`text-sm text-gray-700 whitespace-pre-wrap overflow-auto ${isLarge ? 'max-h-96' : ''}`}>
              {dataString}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">DXF File Parser</h1>
        <p className="text-gray-600">Upload and parse DXF files to view their structure and data</p>
      </div>

      {/* File Upload Section */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="mb-4">
            <label htmlFor="dxf-file-input" className="cursor-pointer">
              <span className="text-lg font-medium text-gray-700">Choose DXF File</span>
              <input
                id="dxf-file-input"
                type="file"
                accept=".dxf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-500 mb-4">Select a .dxf file to parse and analyze</p>
          
          {selectedFile && (
            <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4 inline-block">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">{selectedFile.name}</span>
                <span className="text-xs text-gray-500">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={clearAll}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <X className="h-4 w-4" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700 font-medium">Error</span>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-700 font-medium">Success</span>
          </div>
          <p className="text-green-600 mt-1">DXF file parsed successfully!</p>
        </div>
      )}

      {/* Parsed Data Display */}
      {parsedData && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Parsed DXF Data</h2>
          
          {/* Detailed Data Sections */}
          <div className="space-y-4">
            {parsedData.header && renderDataSection('Header Information', parsedData.header, 'header')}
            
            {/* GEB/GEBERIT Layers Section */}
            {parsedData.tables && parsedData.tables.layer && (
              (() => {
                const allLayers = parsedData.tables.layer.layers || {};
                const gebLayers = Object.entries(allLayers).filter(
                  ([layerName]) => /GEBRIT|GEB/i.test(layerName)
                );
                if (gebLayers.length === 0) return null;
                // Download handler for GEB/GEBERIT Layers
                const handleDownloadGebLayers = () => {
                  const data = Object.fromEntries(gebLayers);
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'geb-geberit-layers.json';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                };
                // Expand/collapse logic
                const sectionId = 'geb-geberit-layers';
                const isLarge = gebLayers.length > 5;
                const isExpanded = expandedSections[sectionId] ?? !isLarge;
                return (
                  <div className="border border-yellow-300 rounded-lg mb-4 bg-yellow-50">
                    <button
                      onClick={() => toggleSection(sectionId)}
                      className="flex items-center justify-between w-full px-4 py-3 font-medium text-yellow-800 bg-yellow-100 rounded-t-lg hover:bg-yellow-200 focus:outline-none"
                    >
                      <span>GEB / GEBERIT Layers ({gebLayers.length})</span>
                      <span className="text-sm text-yellow-700">{isExpanded ? 'Click to collapse' : 'Click to expand'}</span>
                      <button
                        onClick={e => { e.stopPropagation(); handleDownloadGebLayers(); }}
                        className="ml-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold py-1 px-3 rounded text-xs shadow"
                      >
                        Download JSON
                      </button>
                    </button>
                    {isExpanded && (
                      <div className="p-4 max-h-96 overflow-auto">
                        <ul className="list-disc pl-6">
                          {gebLayers.map(([layerName, layerData]) => (
                            <li key={layerName} className="mb-2">
                              <span className="font-semibold text-yellow-900">{layerName}</span>
                              {layerData && (
                                <pre className="text-xs text-gray-700 bg-yellow-200 rounded p-2 mt-1 whitespace-pre-wrap overflow-auto max-w-full">
                                  {JSON.stringify(layerData, null, 2)}
                                </pre>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()
            )}

            {/* GEB/GEBERIT All Elements Section */}
            {parsedData && (() => {
              // Helper to check if a value contains GEB or GEBERIT
              const containsGEB = (val) => typeof val === 'string' && /GEBRIT|GEB/i.test(val);
              // Entities
              const gebEntities = (parsedData.entities || []).filter(entity =>
                Object.values(entity).some(containsGEB)
              );
              // Blocks
              const gebBlocks = Object.entries(parsedData.blocks || {}).filter(
                ([blockName, blockData]) => containsGEB(blockName) || JSON.stringify(blockData).match(/GEBRIT|GEB/i)
              );
              // Layers (already shown above, but for completeness)
              const gebLayers = Object.entries((parsedData.tables && parsedData.tables.layer && parsedData.tables.layer.layers) || {}).filter(
                ([layerName, layerData]) => containsGEB(layerName) || JSON.stringify(layerData).match(/GEBRIT|GEB/i)
              );
              if (gebEntities.length === 0 && gebBlocks.length === 0 && gebLayers.length === 0) return null;
              // Download handler for All Elements
              const handleDownloadAllGeb = () => {
                const data = {
                  entities: gebEntities,
                  blocks: Object.fromEntries(gebBlocks),
                  layers: Object.fromEntries(gebLayers),
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'all-geb-geberit-elements.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              };
              // Expand/collapse logic
              const sectionId = 'all-geb-geberit-elements';
              const isLarge = gebEntities.length + gebBlocks.length + gebLayers.length > 10;
              const isExpanded = expandedSections[sectionId] ?? !isLarge;
              return (
                <div className="border border-orange-300 rounded-lg mb-4 bg-orange-50">
                  <button
                    onClick={() => toggleSection(sectionId)}
                    className="flex items-center justify-between w-full px-4 py-3 font-medium text-orange-800 bg-orange-100 rounded-t-lg hover:bg-orange-200 focus:outline-none"
                  >
                    <span>All Elements Related to GEB / GEBERIT</span>
                    <span className="text-sm text-orange-700">{isExpanded ? 'Click to collapse' : 'Click to expand'}</span>
                    <button
                      onClick={e => { e.stopPropagation(); handleDownloadAllGeb(); }}
                      className="ml-4 bg-orange-400 hover:bg-orange-500 text-orange-900 font-semibold py-1 px-3 rounded text-xs shadow"
                    >
                      Download JSON
                    </button>
                  </button>
                  {isExpanded && (
                    <div className="p-4 space-y-4 max-h-96 overflow-auto">
                      {gebEntities.length > 0 && (
                        <div>
                          <div className="font-semibold text-orange-900 mb-2">Entities ({gebEntities.length})</div>
                          <ul className="list-decimal pl-6">
                            {gebEntities.map((entity, i) => (
                              <li key={entity.handle || i} className="mb-2">
                                <pre className="text-xs text-gray-700 bg-orange-200 rounded p-2 whitespace-pre-wrap overflow-auto max-w-full">
                                  {JSON.stringify(entity, null, 2)}
                                </pre>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {gebBlocks.length > 0 && (
                        <div>
                          <div className="font-semibold text-orange-900 mb-2">Blocks ({gebBlocks.length})</div>
                          <ul className="list-decimal pl-6">
                            {gebBlocks.map(([blockName, blockData]) => (
                              <li key={blockName} className="mb-2">
                                <span className="font-semibold">{blockName}</span>
                                <pre className="text-xs text-gray-700 bg-orange-200 rounded p-2 mt-1 whitespace-pre-wrap overflow-auto max-w-full">
                                  {JSON.stringify(blockData, null, 2)}
                                </pre>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {gebLayers.length > 0 && (
                        <div>
                          <div className="font-semibold text-orange-900 mb-2">Layers ({gebLayers.length})</div>
                          <ul className="list-decimal pl-6">
                            {gebLayers.map(([layerName, layerData]) => (
                              <li key={layerName} className="mb-2">
                                <span className="font-semibold">{layerName}</span>
                                <pre className="text-xs text-gray-700 bg-orange-200 rounded p-2 mt-1 whitespace-pre-wrap overflow-auto max-w-full">
                                  {JSON.stringify(layerData, null, 2)}
                                </pre>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
            
            {/* Full Data Structure */}
            <div>
              {renderDataSection('Complete Data Structure', parsedData, 'complete')}
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(parsedData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'dxf-parsed-data.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                >
                  Download JSON
                </button>
                <button
                  onClick={() => {
                    // Flatten parsedData for CSV
                    const flatten = (obj, prefix = '', res = {}) => {
                      for (const key in obj) {
                        const value = obj[key];
                        const newKey = prefix ? `${prefix}.${key}` : key;
                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                          flatten(value, newKey, res);
                        } else {
                          res[newKey] = Array.isArray(value) ? JSON.stringify(value) : value;
                        }
                      }
                      return res;
                    };
                    const rows = [];
                    if (Array.isArray(parsedData.entities)) {
                      parsedData.entities.forEach((entity, i) => {
                        rows.push(flatten(entity, `entity[${i}]`));
                      });
                    }
                    if (rows.length === 0) rows.push(flatten(parsedData));
                    const headers = Array.from(new Set(rows.flatMap(row => Object.keys(row))));
                    const csv = [headers.join(',')].concat(
                      rows.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
                    ).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'dxf-parsed-data.csv';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                >
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Article Code Block for GEB/GEBERIT text fields from parsed DXF data */}
      {parsedData && (() => {
        // Helper: is GEB/Geberit related if any string field contains GEB or GEBERIT
        const isGebRelated = obj => Object.values(obj).some(
          v => typeof v === 'string' && /GEBRIT|GEB/i.test(v)
        );
        // Helper: extract article code (substring with GEB or GEBRIT and following words/numbers)
        const extractGebCode = text => {
          if (typeof text !== 'string') return null;
          // Match GEB or GEBRIT, followed by up to 20 word/hyphen/space chars, then a number (with optional decimal)
          const match = text.match(/(GEB(?:RIT)?(?:[\w\- ]{0,20})?\d+[.\d]*)/i);
          return match ? match[0].trim() : null;
        };
        const gebCodes = [];
        // From entities
        if (Array.isArray(parsedData.entities)) {
          parsedData.entities.forEach(entity => {
            if (isGebRelated(entity) && entity.text) {
              const code = extractGebCode(entity.text);
              if (code) gebCodes.push(code);
            }
          });
        }
        // From blocks
        if (parsedData.blocks && typeof parsedData.blocks === 'object') {
          Object.values(parsedData.blocks).forEach(block => {
            if (isGebRelated(block) && block.text) {
              const code = extractGebCode(block.text);
              if (code) gebCodes.push(code);
            }
            if (block.entities && Array.isArray(block.entities)) {
              block.entities.forEach(e => {
                if (isGebRelated(e) && e.text) {
                  const code = extractGebCode(e.text);
                  if (code) gebCodes.push(code);
                }
              });
            }
          });
        }
        if (gebCodes.length === 0) return null;
        return (
          <div className="border border-gray-400 rounded-lg bg-gray-50 mb-4">
            <div className="px-4 py-3 font-medium text-gray-800 bg-gray-100 rounded-t-lg">
              GEB / GEBERIT Article Codes from DXF
            </div>
            <div className="p-4 max-h-96 overflow-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {gebCodes.map(t => `• ${t}`).join('\n')}
              </pre>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default DxfFileParser;