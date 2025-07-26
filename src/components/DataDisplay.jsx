import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import { downloadJson, downloadExcel, prepareGebExcelData } from '../utils/excelUtils';
import { extractGebElements } from '../utils/dxfUtils';
import { utils as XLSXUtils, writeFile as XLSXWriteFile } from 'xlsx';

const DataDisplay = ({ parsedData, expandedSections, toggleSection }) => {
  if (!parsedData) return null;

  const gebElements = extractGebElements(parsedData);

  const handleDownloadHeader = () => {
    downloadJson(parsedData.header, 'dxf-header-information.json');
  };

  const handleDownloadComplete = () => {
    downloadJson(parsedData, 'dxf-parsed-data.json');
  };

  const handleDownloadGebLayers = () => {
    const data = Object.fromEntries(gebElements.layers);
    downloadJson(data, 'geb-geberit-layers.json');
  };

  const handleDownloadGebLayersExcel = () => {
    const gebLayerRows = gebElements.layers.map(([layerName, layerData]) => ({
      name: layerName,
      frozen: layerData?.frozen ?? '',
      visible: layerData?.visible ?? '',
      colorIndex: layerData?.colorIndex ?? '',
      color: layerData?.color ?? '',
    }));
    downloadExcel(gebLayerRows, 'GEB-GEBERIT Layers', 'geb-geberit-layers.xlsx');
  };

  const handleDownloadAllGeb = () => {
    const data = {
      entities: gebElements.entities,
      blocks: Object.fromEntries(gebElements.blocks),
      layers: Object.fromEntries(gebElements.layers),
    };
    downloadJson(data, 'all-geb-geberit-elements.json');
  };

  const handleDownloadAllGebExcel = () => {
    const { entitiesSheet, blocksSheet, layersSheet } = prepareGebExcelData(gebElements);
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
  };

  const handleDownloadArticleCodes = () => {
    downloadJson(gebElements.articleCodes, 'article-codes.json');
  };

  const handleDownloadArticleCodesExcel = () => {
    downloadExcel(gebElements.articleCodes, 'Article Codes', 'article-codes.xlsx');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Parsed DXF Data</h2>
      
      <div className="space-y-4">
        {/* Header Information */}
        {parsedData.header && (
          <CollapsibleSection
            title="Header Information"
            isExpanded={expandedSections['header'] || false}
            onToggle={() => toggleSection('header')}
            downloadButtons={[
              { label: 'Download JSON', onClick: handleDownloadHeader }
            ]}
          >
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto">
              {JSON.stringify(parsedData.header, null, 2)}
            </pre>
          </CollapsibleSection>
        )}

        {/* Complete Data Structure */}
        <CollapsibleSection
          title="Complete Data Structure"
          isExpanded={expandedSections['complete'] || false}
          onToggle={() => toggleSection('complete')}
          downloadButtons={[
            { label: 'Download JSON', onClick: handleDownloadComplete }
          ]}
        >
          <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto">
            {JSON.stringify(parsedData, null, 2)}
          </pre>
        </CollapsibleSection>

        {/* GEB/GEBERIT Layers */}
        {gebElements.layers.length > 0 && (
          <CollapsibleSection
            title="GEB / GEBERIT Layers"
            isExpanded={expandedSections['geb-geberit-layers'] ?? gebElements.layers.length <= 5}
            onToggle={() => toggleSection('geb-geberit-layers')}
            itemCount={gebElements.layers.length}
            downloadButtons={[
              { label: 'Download JSON', onClick: handleDownloadGebLayers },
              { label: 'Download Excel', onClick: handleDownloadGebLayersExcel, className: 'bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm' }
            ]}
          >
            <div className="max-h-96 overflow-auto">
              <ul className="list-disc pl-6">
                {gebElements.layers.map(([layerName, layerData]) => (
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
          </CollapsibleSection>
        )}

        {/* All GEB/GEBERIT Elements */}
        {(gebElements.entities.length > 0 || gebElements.blocks.length > 0 || gebElements.layers.length > 0) && (
          <CollapsibleSection
            title="All Elements Related to GEB / GEBERIT"
            isExpanded={expandedSections['all-geb-geberit-elements'] ?? (gebElements.entities.length + gebElements.blocks.length + gebElements.layers.length <= 10)}
            onToggle={() => toggleSection('all-geb-geberit-elements')}
            downloadButtons={[
              { label: 'Download JSON', onClick: handleDownloadAllGeb },
              { label: 'Download Excel', onClick: handleDownloadAllGebExcel, className: 'bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm' }
            ]}
          >
            <div className="space-y-4 max-h-96 overflow-auto">
              {gebElements.entities.length > 0 && (
                <div>
                  <div className="font-semibold text-gray-800 mb-2">Entities ({gebElements.entities.length})</div>
                  <ul className="list-decimal pl-6">
                    {gebElements.entities.map((entity, idx) => (
                      <li key={idx} className="mb-2">
                        <pre className="text-xs text-gray-700 bg-gray-100 rounded p-2 whitespace-pre-wrap overflow-auto max-w-full">
                          {JSON.stringify(entity, null, 2)}
                        </pre>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {gebElements.blocks.length > 0 && (
                <div>
                  <div className="font-semibold text-gray-800 mb-2">Blocks ({gebElements.blocks.length})</div>
                  <ul className="list-decimal pl-6">
                    {gebElements.blocks.map(([blockName, blockData]) => (
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
              {gebElements.layers.length > 0 && (
                <div>
                  <div className="font-semibold text-gray-800 mb-2">Layers ({gebElements.layers.length})</div>
                  <ul className="list-decimal pl-6">
                    {gebElements.layers.map(([layerName, layerData]) => (
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
          </CollapsibleSection>
        )}

        {/* Article Codes */}
        {gebElements.articleCodes.length > 0 && (
          <CollapsibleSection
            title="GEB / GEBERIT Article Codes from DXF"
            isExpanded={expandedSections['article-codes'] ?? false}
            onToggle={() => toggleSection('article-codes')}
            itemCount={gebElements.articleCodes.length}
            downloadButtons={[
              { label: 'Download JSON', onClick: handleDownloadArticleCodes },
              { label: 'Download Excel', onClick: handleDownloadArticleCodesExcel, className: 'bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm' }
            ]}
          >
            <div className="max-h-96 overflow-auto">
              <ul className="list-disc pl-6">
                {gebElements.articleCodes.map((code, idx) => (
                  <li key={idx} className="mb-1 text-gray-700 text-sm">{code}</li>
                ))}
              </ul>
            </div>
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
};

export default DataDisplay; 