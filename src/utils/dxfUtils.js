// DXF file processing utilities
export const cleanDxfText = (text) => {
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

export const validateDxfFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  const fileExtension = file.name.toLowerCase().split('.').pop();
  if (fileExtension !== 'dxf') {
    return { isValid: false, error: 'Please select a valid DXF file (.dxf extension required)' };
  }

  const maxSize = 200 * 1024 * 1024; // 200MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size too large. Please select a file smaller than 200MB.' };
  }

  return { isValid: true, error: null };
};

export const extractGebElements = (parsedData) => {
  const containsGEB = (val) => typeof val === 'string' && /GEBRIT|GEB/i.test(val);
  const isGebLayer = layerName => typeof layerName === 'string' && /GEBRIT|GEB/i.test(layerName);

  // Extract GEB entities
  const gebEntities = (parsedData.entities || []).filter(entity =>
    Object.values(entity).some(containsGEB)
  );

  // Extract GEB blocks
  const gebBlocks = Object.entries(parsedData.blocks || {}).filter(
    ([blockName, blockData]) => containsGEB(blockName) || JSON.stringify(blockData).match(/GEBRIT|GEB/i)
  );

  // Extract GEB layers
  const gebLayers = Object.entries((parsedData.tables && parsedData.tables.layer && parsedData.tables.layer.layers) || {}).filter(
    ([layerName, layerData]) => containsGEB(layerName) || JSON.stringify(layerData).match(/GEBRIT|GEB/i)
  );

  // Extract article codes
  const gebCodes = [];
  
  // From entities
  if (Array.isArray(parsedData.entities)) {
    parsedData.entities.forEach(entity => {
      if (entity.layer && isGebLayer(entity.layer) && entity.text) {
        const cleanedText = cleanDxfText(entity.text);
        if (cleanedText) gebCodes.push(cleanedText);
      }
    });
  }

  // From blocks
  if (parsedData.blocks && typeof parsedData.blocks === 'object') {
    Object.entries(parsedData.blocks).forEach(([blockName, block]) => {
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

  const uniqueGebCodes = [...new Set(gebCodes.filter(code => code.length > 0))];

  return {
    entities: gebEntities,
    blocks: gebBlocks,
    layers: gebLayers,
    articleCodes: uniqueGebCodes
  };
}; 