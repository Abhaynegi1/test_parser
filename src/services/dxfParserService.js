import DxfParser from 'dxf-parser';
import { validateDxfFile } from '../utils/dxfUtils.js';

export class DxfParserService {
  static async parseDxfFile(file) {
    const validation = validateDxfFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    try {
      const fileContent = await this.readFileContent(file);
      const parser = new DxfParser();
      const dxfData = parser.parseSync(fileContent);

      if (!dxfData) {
        throw new Error('Failed to parse DXF file - invalid format or corrupted file');
      }

      return dxfData;
    } catch (error) {
      console.error('DXF Parsing Error:', error);
      throw new Error(`Parsing failed: ${error.message || 'Unknown error occurred'}`);
    }
  }

  static readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
} 