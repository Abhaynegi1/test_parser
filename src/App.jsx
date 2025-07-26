import React from 'react';
import FileUpload from './components/FileUpload';
import StatusMessage from './components/StatusMessage';
import DataDisplay from './components/DataDisplay';
import { useDxfParser } from './hooks/useDxfParser';

const DxfFileParser = () => {
  const {
    selectedFile,
    parsedData,
    error,
    success,
    loading,
    expandedSections,
    handleFileSelect,
    toggleSection
  } = useDxfParser();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">DXF File Parser</h1>
        <p className="text-gray-600">Upload and parse DXF files to view their structure and data</p>
      </div>

      <FileUpload 
        selectedFile={selectedFile} 
        onFileSelect={handleFileSelect} 
      />

      <StatusMessage 
        loading={loading} 
        error={error} 
        success={success} 
      />

      <DataDisplay 
        parsedData={parsedData}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      />
    </div>
  );
};

export default DxfFileParser;
