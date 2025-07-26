import React from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const StatusMessage = ({ loading, error, success }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center mb-6">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500 mr-2" />
        <span className="text-blue-700 font-medium">Parsing DXF file, please wait...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700 font-medium">Error</span>
        </div>
        <p className="text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-green-700 font-medium">Success</span>
        </div>
        <p className="text-green-600 mt-1">DXF file parsed successfully!</p>
      </div>
    );
  }

  return null;
};

export default StatusMessage; 