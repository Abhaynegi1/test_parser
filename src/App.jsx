import React, { useState } from 'react';
import DxfParser from 'dxf-parser';
import { Upload, FileText, AlertCircle, CheckCircle, X, Loader2, Table } from 'lucide-react';
import { utils as XLSXUtils, writeFile as XLSXWriteFile } from 'xlsx';
// Removed import of gebElements, will use parsedData


const DxfFileParser = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper function to clean DXF text formatting codes
  const cleanDxfText = (text) => {
    if (typeof text !== 'string') return '';
    
    let cleaned = text;
    
    // Remove font formatting codes like {\fArial|b0|i0|c0|p34; ... }
    cleaned = cleaned.replace(/\{\\f[^;]*;([^}]*)\}/g, '$1');
    
    // Remove any remaining curly braces formatting
    cleaned = cleaned.replace(/\{[^}]*\}/g, '');
    
    // Handle DXF escape sequences
    cleaned = cleaned.replace(/\\P/g, ' '); // Paragraph break -> space
    cleaned = cleaned.replace(/%%C/g, '°'); // Degree symbol
    cleaned = cleaned.replace(/%%D/g, '±'); // Plus/minus
    cleaned = cleaned.replace(/%%U/g, ''); // Underline start
    cleaned = cleaned.replace(/%%u/g, ''); // Underline end
    cleaned = cleaned.replace(/%%O/g, ''); // Overline start
    cleaned = cleaned.replace(/%%o/g, ''); // Overline end
    cleaned = cleaned.replace(/%%\d+/g, ''); // Other %% codes
    
    // Remove extra whitespace and trim
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    return cleaned;
  };

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
    const maxSize = 200 * 1024 * 1024; // 150MB
    if (file.size > maxSize) {
      setError('File size too large. Please select a file smaller than 150MB.');
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

    setLoading(true);
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
      setLoading(false);


    } catch (err) {
      console.error('DXF Parsing Error:', err);
      setError(`Parsing failed: ${err.message || 'Unknown error occurred'}`);
      setParsedData(null);
      setSuccess(false);
      setLoading(false);
    }
  };


  // Helper to download Excel for a given data and sheet name
  const downloadExcel = (data, sheetName, fileName) => {
    let ws;
    if (Array.isArray(data)) {
      if (data.length > 0 && typeof data[0] === 'object') {
        // Add Serial No. column
        const dataWithSerial = data.map((row, idx) => ({ 'Serial No.': idx + 1, ...row }));
        ws = XLSXUtils.json_to_sheet(dataWithSerial);
      } else {
        // For arrays of strings (e.g., article codes)
        ws = XLSXUtils.aoa_to_sheet([["Serial No.", sheetName]]);
        data.forEach((val, idx) => {
          XLSXUtils.sheet_add_aoa(ws, [[idx + 1, val]], { origin: -1 });
        });
      }
    } else if (typeof data === 'object') {
      ws = XLSXUtils.json_to_sheet([{ 'Serial No.': 1, ...data }]);
    } else {
      ws = XLSXUtils.aoa_to_sheet([["Serial No.", "Value"], [1, String(data)]]);
    }
    const wb = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(wb, ws, sheetName);
    XLSXWriteFile(wb, fileName);
  };


  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({});


  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };


  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">DXF File Parser</h1>
        <p className="text-gray-600">Upload and parse DXF files to view their structure and data</p>
      </div>


      {/* File Upload Section */}
      <label htmlFor="dxf-file-input" className="block cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 transition hover:bg-gray-100 focus-within:bg-gray-100">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="mb-4">
            <span className="text-lg font-medium text-gray-700">Choose DXF File</span>
            <input
              id="dxf-file-input"
              type="file"
              accept=".dxf"
              onChange={handleFileSelect}
              className="hidden"
            />
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
      </label>


      {/* Action Buttons */}
      {/* Removed Clear All button as per request */}


      {/* Status Messages */}
      {loading && (
        <div className="flex justify-center items-center mb-6">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500 mr-2" />
          <span className="text-blue-700 font-medium">Parsing DXF file, please wait...</span>
        </div>
      )}
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
            {parsedData.header && (
              (() => {
                const sectionId = 'header';
                const isExpanded = expandedSections[sectionId] || false;
                const handleDownloadHeader = (e) => {
                  e.stopPropagation();
                  const blob = new Blob([JSON.stringify(parsedData.header, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'dxf-header-information.json';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                };
                return (
                  <div className="border border-gray-300 rounded-lg mb-4 bg-gray-50">
                    <div
                      onClick={() => toggleSection(sectionId)}
                      role="button"
                      tabIndex={0}
                      className="w-full px-4 py-3 text-left font-bold text-gray-800 bg-gray-100 rounded-t-lg hover:bg-gray-200 flex justify-between items-center cursor-pointer"
                    >
                      <span className="text-base font-bold text-gray-800">Header Information</span>
                      <span className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-normal">{isExpanded ? 'Click to collapse' : 'Click to expand'}</span>
                        <button
                          onClick={handleDownloadHeader}
                          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                        >
                          Download JSON
                        </button>
                      </span>
                    </div>
                    {isExpanded && (
                      <div className="p-4 bg-white rounded-b-lg">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto">
                          {JSON.stringify(parsedData.header, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })()
            )}
            {/* Move Complete Data Structure block here, under Header Information */}
            <div>
              {(() => {
                const sectionId = 'complete';
                const isExpanded = expandedSections[sectionId] || false;
                const handleDownloadComplete = (e) => {
                  e.stopPropagation();
                  const blob = new Blob([JSON.stringify(parsedData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'dxf-parsed-data.json';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                };
                return (
                  <div className="border border-gray-300 rounded-lg mb-4 bg-gray-50">
                    <div
                      onClick={() => toggleSection(sectionId)}
                      role="button"
                      tabIndex={0}
                      className="w-full px-4 py-3 text-left font-bold text-gray-800 bg-gray-100 rounded-t-lg hover:bg-gray-200 flex justify-between items-center cursor-pointer"
                    >
                      <span className="text-base font-bold text-gray-800">Complete Data Structure</span>
                      <span className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-normal">{isExpanded ? 'Click to collapse' : 'Click to expand'}</span>
                        <button
                          onClick={handleDownloadComplete}
                          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                        >
                          Download JSON
                        </button>
                      </span>
                    </div>
                    {isExpanded && (
                      <div className="p-4 bg-white rounded-b-lg">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto">
                          {JSON.stringify(parsedData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            
            {/* GEB/GEBERIT Layers Section */}
            {parsedData.tables && parsedData.tables.layer && (
              (() => {
                const allLayers = parsedData.tables.layer.layers || {};
                const gebLayers = Object.entries(allLayers).filter(
                  ([layerName]) => /GEBRIT|GEB/i.test(layerName)
                );
                if (gebLayers.length === 0) return null;
                const sectionId = 'geb-geberit-layers';
                const isLarge = gebLayers.length > 5;
                const isExpanded = expandedSections[sectionId] ?? !isLarge;
                const handleDownloadGebLayers = (e) => {
                  e.stopPropagation();
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
                return (
                  <div className="border border-gray-300 rounded-lg mb-4 bg-gray-50">
                    <div
                      onClick={() => toggleSection(sectionId)}
                      role="button"
                      tabIndex={0}
                      className="w-full px-4 py-3 text-left font-bold text-gray-800 bg-gray-100 rounded-t-lg hover:bg-gray-200 flex justify-between items-center cursor-pointer"
                    >
                      <span className="text-base font-bold text-gray-800">GEB / GEBERIT Layers ({gebLayers.length})</span>
                      <span className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-normal">{isExpanded ? 'Click to collapse' : 'Click to expand'}</span>
                        <button
                          onClick={handleDownloadGebLayers}
                          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                        >
                          Download JSON
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            // Prepare rows for Excel: columns are name, frozen, visible, colorIndex, color
                            const gebLayerRows = gebLayers.map(([layerName, layerData]) => ({
                              name: layerName,
                              frozen: layerData?.frozen ?? '',
                              visible: layerData?.visible ?? '',
                              colorIndex: layerData?.colorIndex ?? '',
                              color: layerData?.color ?? '',
                            }));
                            downloadExcel(gebLayerRows, 'GEB-GEBERIT Layers', 'geb-geberit-layers.xlsx');
                          }}
                          className="ml-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                        >
                          Download Excel
                        </button>
                      </span>
                    </div>
                    {isExpanded && (
                      <div className="p-4 max-h-96 overflow-auto">
                        <ul className="list-disc pl-6">
                          {gebLayers.map(([layerName, layerData]) => (
                            <li key={layerName} className="mb-2">
                              <span className="font-semibold text-gray-800">{layerName}</span>
                              {layerData && (
                                <pre className="text-xs text-gray-700 bg-gray-100 rounded p-2 mt-1 whitespace-pre-wrap overflow-auto max-w-full">
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
              const sectionId = 'all-geb-geberit-elements';
              const isLarge = gebEntities.length + gebBlocks.length + gebLayers.length > 10;
              const isExpanded = expandedSections[sectionId] ?? !isLarge;
              const handleDownloadAllGeb = (e) => {
                e.stopPropagation();
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
              return (
                <div className="border border-gray-300 rounded-lg mb-4 bg-gray-50">
                  <div
                    onClick={() => toggleSection(sectionId)}
                    role="button"
                    tabIndex={0}
                    className="w-full px-4 py-3 text-left font-bold text-gray-800 bg-gray-100 rounded-t-lg hover:bg-gray-200 flex justify-between items-center cursor-pointer"
                  >
                    <span className="text-base font-bold text-gray-800">All Elements Related to GEB / GEBERIT</span>
                    <span className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-normal">{isExpanded ? 'Click to collapse' : 'Click to expand'}</span>
                      <button
                        onClick={handleDownloadAllGeb}
                        className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                      >
                        Download JSON
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          // Prepare Entities sheet
                          const entitiesSheet = gebEntities.map((entity, idx) => ({
                            'Serial No.': idx + 1,
                            type: entity.type ?? '',
                            handle: entity.handle ?? '',
                            ownerHandle: entity.ownerHandle ?? '',
                            layer: entity.layer ?? '',
                            name: entity.name ?? '',
                            lineType: entity.lineType ?? '',
                            lineweight: entity.lineweight ?? '',
                            colorIndex: entity.colorIndex ?? '',
                            color: entity.color ?? '',
                            position_x: entity.position?.x ?? '',
                            position_y: entity.position?.y ?? '',
                            position_z: entity.position?.z ?? '',
                            rotation: entity.rotation ?? '',
                            xScale: entity.xScale ?? '',
                            vertices: entity.vertices ? JSON.stringify(entity.vertices) : '',
                            center_x: entity.center?.x ?? '',
                            center_y: entity.center?.y ?? '',
                            center_z: entity.center?.z ?? '',
                            radius: entity.radius ?? '',
                            text: entity.text ?? '',
                            textHeight: entity.textHeight ?? '',
                            startPoint_x: entity.startPoint?.x ?? '',
                            startPoint_y: entity.startPoint?.y ?? '',
                            startPoint_z: entity.startPoint?.z ?? '',
                            endPoint_x: entity.endPoint?.x ?? '',
                            endPoint_y: entity.endPoint?.y ?? '',
                            endPoint_z: entity.endPoint?.z ?? '',
                            lineTypeScale: entity.lineTypeScale ?? '',
                            shape: entity.shape ?? '',
                            hasContinuousLinetypePattern: entity.hasContinuousLinetypePattern ?? '',
                            width: entity.width ?? '',
                            otherProps: (() => {
                              const omit = [
                                'type','handle','ownerHandle','layer','name','lineType','lineweight','colorIndex','color','position','rotation','xScale','vertices','center','radius','text','textHeight','startPoint','endPoint','lineTypeScale','shape','hasContinuousLinetypePattern','width'
                              ];
                              const rest = Object.fromEntries(Object.entries(entity).filter(([k]) => !omit.includes(k)));
                              return Object.keys(rest).length ? JSON.stringify(rest) : '';
                            })(),
                          }));
                          // Prepare Blocks sheet
                          const blocksSheet = gebBlocks.map(([blockName, block], idx) => ({
                            'Serial No.': idx + 1,
                            block_name: blockName,
                            handle: block.handle ?? '',
                            ownerHandle: block.ownerHandle ?? '',
                            layer: block.layer ?? '',
                            name2: block.name2 ?? '',
                            xrefPath: block.xrefPath ?? '',
                            position_x: block.position?.x ?? '',
                            position_y: block.position?.y ?? '',
                            position_z: block.position?.z ?? '',
                            entities_count: Array.isArray(block.entities) ? block.entities.length : '',
                            otherProps: (() => {
                              const omit = [
                                'handle','ownerHandle','layer','name2','xrefPath','position','entities'
                              ];
                              const rest = Object.fromEntries(Object.entries(block).filter(([k]) => !omit.includes(k)));
                              return Object.keys(rest).length ? JSON.stringify(rest) : '';
                            })(),
                          }));
                          // Prepare Layers sheet
                          const layersSheet = gebLayers.map(([layerName, layerData], idx) => ({
                            'Serial No.': idx + 1,
                            layer_name: layerName,
                            name: layerData?.name ?? '',
                            frozen: layerData?.frozen ?? '',
                            visible: layerData?.visible ?? '',
                            colorIndex: layerData?.colorIndex ?? '',
                            color: layerData?.color ?? '',
                          }));
                          // Create workbook with three sheets
                          const wb = XLSXUtils.book_new();
                          if (entitiesSheet.length) {
                            XLSXUtils.book_append_sheet(wb, XLSXUtils.json_to_sheet(entitiesSheet), 'Entities');
                          }
                          if (blocksSheet.length) {
                            XLSXUtils.book_append_sheet(wb, XLSXUtils.json_to_sheet(blocksSheet), 'Blocks');
                          }
                          if (layersSheet.length) {
                            XLSXUtils.book_append_sheet(wb, XLSXUtils.json_to_sheet(layersSheet), 'Layers');
                          }
                          XLSXWriteFile(wb, 'all-geb-geberit-elements.xlsx');
                        }}
                        className="ml-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                      >
                        Download Excel
                      </button>
                    </span>
                  </div>
                  {isExpanded && (
                    <div className="p-4 space-y-4 max-h-96 overflow-auto">
                      {gebEntities.length > 0 && (
                        <div>
                          <div className="font-semibold text-gray-800 mb-2">Entities ({gebEntities.length})</div>
                          <ul className="list-decimal pl-6">
                            {gebEntities.map((entity, idx) => (
                              <li key={idx} className="mb-2">
                                <pre className="text-xs text-gray-700 bg-gray-100 rounded p-2 whitespace-pre-wrap overflow-auto max-w-full">
                                  {JSON.stringify(entity, null, 2)}
                                </pre>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {gebBlocks.length > 0 && (
                        <div>
                          <div className="font-semibold text-gray-800 mb-2">Blocks ({gebBlocks.length})</div>
                          <ul className="list-decimal pl-6">
                            {gebBlocks.map(([blockName, blockData]) => (
                              <li key={blockName} className="mb-2">
                                <span className="font-semibold">{blockName}</span>
                                <pre className="text-xs text-gray-700 bg-gray-100 rounded p-2 mt-1 whitespace-pre-wrap overflow-auto max-w-full">
                                  {JSON.stringify(blockData, null, 2)}
                                </pre>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {gebLayers.length > 0 && (
                        <div>
                          <div className="font-semibold text-gray-800 mb-2">Layers ({gebLayers.length})</div>
                          <ul className="list-decimal pl-6">
                            {gebLayers.map(([layerName, layerData]) => (
                              <li key={layerName} className="mb-2">
                                <span className="font-semibold">{layerName}</span>
                                <pre className="text-xs text-gray-700 bg-gray-100 rounded p-2 mt-1 whitespace-pre-wrap overflow-auto max-w-full">
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
            
            {/* Article Code Block for GEB/GEBERIT text fields from parsed DXF data */}
            {parsedData && (() => {
              // Helper: check if layer name contains GEB or GEBERIT
              const isGebLayer = layerName => typeof layerName === 'string' && /GEBRIT|GEB/i.test(layerName);
              const gebCodes = [];
              // From entities - check if entity's layer is GEB/GEBERIT related
              if (Array.isArray(parsedData.entities)) {
                parsedData.entities.forEach(entity => {
                  if (entity.layer && isGebLayer(entity.layer) && entity.text) {
                    // Clean and extract text from entities on GEB/GEBERIT layers
                    const cleanedText = cleanDxfText(entity.text);
                    if (cleanedText) gebCodes.push(cleanedText);
                  }
                });
              }
              // From blocks - check if block's layer is GEB/GEBERIT related or block name contains GEB/GEBERIT
              if (parsedData.blocks && typeof parsedData.blocks === 'object') {
                Object.entries(parsedData.blocks).forEach(([blockName, block]) => {
                  // Check if block name contains GEB/GEBERIT or if block has GEB/GEBERIT layer
                  const isGebBlock = isGebLayer(blockName) || (block.layer && isGebLayer(block.layer));
                  if (isGebBlock && block.text) {
                    const cleanedText = cleanDxfText(block.text);
                    if (cleanedText) gebCodes.push(cleanedText);
                  }
                  if (block.entities && Array.isArray(block.entities)) {
                    block.entities.forEach(e => {
                      if (e.layer && isGebLayer(e.layer) && e.text) {
                        const cleanedText = cleanDxfText(e.text);
                        if (cleanedText) gebCodes.push(cleanedText);
                      }
                    });
                  }
                });
              }
              // Remove duplicates and filter out empty strings
              const uniqueGebCodes = [...new Set(gebCodes.filter(code => code.length > 0))];
              if (uniqueGebCodes.length === 0) return null;
              // Expand/collapse logic
              const sectionId = 'article-codes';
              const isExpanded = expandedSections[sectionId] ?? false;
              return (
                <div className="border border-gray-300 rounded-lg mb-4 bg-gray-50">
                  <div
                    onClick={() => toggleSection(sectionId)}
                    role="button"
                    tabIndex={0}
                    className="w-full px-4 py-3 text-left font-bold text-gray-800 bg-gray-100 rounded-t-lg hover:bg-gray-200 flex justify-between items-center cursor-pointer"
                  >
                    <span className="text-base font-bold text-gray-800">GEB / GEBERIT Article Codes from DXF ({uniqueGebCodes.length} items)</span>
                    <span className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-normal">{isExpanded ? 'Click to collapse' : 'Click to expand'}</span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          const blob = new Blob([JSON.stringify(uniqueGebCodes, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'article-codes.json';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                      >
                        Download JSON
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          downloadExcel(uniqueGebCodes, 'Article Codes', 'article-codes.xlsx');
                        }}
                        className="ml-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                      >
                        Download Excel
                      </button>
                    </span>
                  </div>
                  {isExpanded && (
                    <div className="p-4 max-h-96 overflow-auto">
                      <ul className="list-disc pl-6">
                        {uniqueGebCodes.map((t, idx) => (
                          <li key={idx} className="mb-1 text-gray-700 text-sm">{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};


export default DxfFileParser;
