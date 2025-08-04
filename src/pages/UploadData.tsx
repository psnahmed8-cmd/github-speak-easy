import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, X, AlertCircle, Database, Zap } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  preview?: string;
}

export default function UploadData() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = (files: File[]) => {
    const validTypes = ['.csv', '.xlsx', '.xls', '.json'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!validTypes.includes(extension)) {
        toast.error(`File ${file.name} is not a supported format`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    validFiles.forEach(file => {
      const fileObj: UploadedFile = {
        file,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        status: 'uploading',
        progress: 0,
      };

      setUploadedFiles(prev => [...prev, fileObj]);
      processFile(fileObj);
    });
  };

  const processFile = async (fileObj: UploadedFile) => {
    // Simulate file processing
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileObj.id ? { ...f, progress } : f)
      );
    }

    // Simulate validation and processing
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileObj.id ? { ...f, status: 'processing' } : f)
    );

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate preview data
    const preview = generatePreview(fileObj.file);
    
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileObj.id ? { 
        ...f, 
        status: 'completed', 
        progress: 100,
        preview 
      } : f)
    );

    toast.success(`${fileObj.file.name} processed successfully!`);
  };

  const generatePreview = (file: File): string => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'csv':
        return 'CSV data detected: 1,234 rows, 15 columns\nColumns: timestamp, temperature, pressure, flow_rate, vibration, ...';
      case 'xlsx':
      case 'xls':
        return 'Excel data detected: 856 rows, 12 columns\nWorksheets: ProcessData, Parameters, Events';
      case 'json':
        return 'JSON data detected: 45 objects\nStructure: incident_reports, sensor_data, maintenance_logs';
      default:
        return 'Data processed successfully';
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const startAnalysis = async () => {
    const completedFiles = uploadedFiles.filter(f => f.status === 'completed');
    if (completedFiles.length === 0) {
      toast.error('Please upload and process at least one file before starting analysis');
      return;
    }

    setIsProcessing(true);
    
    // Simulate RCA analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    toast.success('RCA analysis completed! Check your Analysis Results.');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Upload Process Data</h1>
          <p className="text-gray-400 mt-1">Upload your data files to begin root cause analysis</p>
        </div>
        {uploadedFiles.some(f => f.status === 'completed') && (
          <button
            onClick={startAnalysis}
            disabled={isProcessing}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isProcessing ? (
              <>
                <LoadingSpinner />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Start RCA Analysis</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
          dragActive 
            ? 'border-purple-400 bg-purple-500/10' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            {dragActive ? 'Drop files here' : 'Drag & drop your files here'}
          </h3>
          <p className="text-gray-400 mb-4">
            or <label htmlFor="file-upload" className="cursor-pointer text-purple-400 hover:text-purple-300 font-semibold">browse to upload</label>
          </p>
          <p className="text-sm text-gray-500">
            Supports CSV, Excel (.xlsx, .xls), and JSON files up to 10MB
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".csv,.xlsx,.xls,.json"
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Supported Formats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center space-x-3 mb-2">
            <FileText className="w-6 h-6 text-green-400" />
            <h3 className="font-semibold text-white">CSV Files</h3>
          </div>
          <p className="text-sm text-gray-400">
            Process data, sensor readings, incident logs with timestamps and parameters
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center space-x-3 mb-2">
            <Database className="w-6 h-6 text-blue-400" />
            <h3 className="font-semibold text-white">Excel Sheets</h3>
          </div>
          <p className="text-sm text-gray-400">
            Multi-worksheet data with process parameters, maintenance logs, and events
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center space-x-3 mb-2">
            <FileText className="w-6 h-6 text-purple-400" />
            <h3 className="font-semibold text-white">JSON Data</h3>
          </div>
          <p className="text-sm text-gray-400">
            Structured incident reports, API data, and nested process information
          </p>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Uploaded Files</h3>
          <div className="space-y-4">
            {uploadedFiles.map((fileObj) => (
              <div key={fileObj.id} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-white font-medium">{fileObj.file.name}</span>
                    <span className="text-sm text-gray-400">
                      ({(fileObj.file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {fileObj.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    {fileObj.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <button
                      onClick={() => removeFile(fileObj.id)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {(fileObj.status === 'uploading' || fileObj.status === 'processing') && (
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>
                        {fileObj.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                      </span>
                      <span>{fileObj.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${fileObj.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {fileObj.status === 'completed' && fileObj.preview && (
                  <div className="mt-2 p-3 bg-gray-600/50 rounded border border-gray-600">
                    <h4 className="text-sm font-medium text-white mb-1">Data Preview:</h4>
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap">{fileObj.preview}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Processing Guidelines */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Data Processing Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-white mb-2">Recommended Data Structure</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Include timestamps for all events</li>
              <li>• Provide process parameters (temperature, pressure, flow)</li>
              <li>• Add incident descriptions and severity levels</li>
              <li>• Include equipment IDs and maintenance records</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">AI Enhancement Tips</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Use descriptive column headers</li>
              <li>• Include contextual information</li>
              <li>• Provide multiple data sources when available</li>
              <li>• Ensure data quality and completeness</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}