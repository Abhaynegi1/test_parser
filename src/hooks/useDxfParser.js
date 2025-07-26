import { useState } from 'react';
import { DxfParserService } from '../services/dxfParserService';

export const useDxfParser = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    
    // Reset previous states
    setError(null);
    setSuccess(false);
    setParsedData(null);
    
    if (!file) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    await parseDxfFile(file);
  };

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
      const dxfData = await DxfParserService.parseDxfFile(fileToParse);
      setParsedData(dxfData);
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      setParsedData(null);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return {
    selectedFile,
    parsedData,
    error,
    success,
    loading,
    expandedSections,
    handleFileSelect,
    parseDxfFile,
    toggleSection
  };
}; 