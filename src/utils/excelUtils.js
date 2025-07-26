import { utils as XLSXUtils, writeFile as XLSXWriteFile } from 'xlsx';

export const downloadExcel = (data, sheetName, fileName) => {
  let ws;
  if (Array.isArray(data)) {
    if (data.length > 0 && typeof data[0] === 'object') {
      const dataWithSerial = data.map((row, idx) => ({ 'Serial No.': idx + 1, ...row }));
      ws = XLSXUtils.json_to_sheet(dataWithSerial);
    } else {
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

export const downloadJson = (data, fileName) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const prepareGebExcelData = (gebElements) => {
  const { entities, blocks, layers } = gebElements;
  
  // Prepare Entities sheet
  const entitiesSheet = entities.map((entity, idx) => ({
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
  const blocksSheet = blocks.map(([blockName, block], idx) => ({
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
  const layersSheet = layers.map(([layerName, layerData], idx) => ({
    'Serial No.': idx + 1,
    layer_name: layerName,
    name: layerData?.name ?? '',
    frozen: layerData?.frozen ?? '',
    visible: layerData?.visible ?? '',
    colorIndex: layerData?.colorIndex ?? '',
    color: layerData?.color ?? '',
  }));

  return { entitiesSheet, blocksSheet, layersSheet };
}; 