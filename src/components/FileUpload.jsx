import React from 'react';
import { Upload, FileText } from 'lucide-react';

const FileUpload = ({ selectedFile, onFileSelect, accept = ".dxf" }) => {
  return (
    <label htmlFor="dxf-file-input" className="block cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 transition hover:bg-gray-100 focus-within:bg-gray-100">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="mb-4">
          <span className="text-lg font-medium text-gray-700">Choose DXF File</span>
          <input
            id="dxf-file-input"
            type="file"
            accept={accept}
            onChange={onFileSelect}
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
  );
};

export default FileUpload; 