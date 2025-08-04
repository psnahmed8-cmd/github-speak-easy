import React, { useState } from 'react';
import { FileText, Download, Share2, Eye, Calendar, Filter, Search, ArrowUpRight, AlertTriangle, CheckCircle } from 'lucide-react';

interface RCAReport {
  id: string;
  title: string;
  date: string;
  dataset: string;
  rootCause: string;
  status: 'completed' | 'in-progress' | 'draft';
  severity: 'high' | 'medium' | 'low';
  correctiveActions: number;
  summary: string;
}

const mockReports: RCAReport[] = [
  {
    id: '1',
    title: 'Pump Failure Analysis - Line 3',
    date: '2024-01-15',
    dataset: 'ProcessData_Jan2024.csv',
    rootCause: 'Bearing wear due to inadequate lubrication schedule',
    status: 'completed',
    severity: 'high',
    correctiveActions: 4,
    summary: 'Analysis revealed that the primary cause of pump failure was bearing deterioration resulting from extended lubrication intervals.',
  },
  {
    id: '2',
    title: 'Temperature Spike Investigation',
    date: '2024-01-12',
    dataset: 'SensorData_Week2.xlsx',
    rootCause: 'Heat exchanger fouling and reduced cooling efficiency',
    status: 'completed',
    severity: 'medium',
    correctiveActions: 3,
    summary: 'Temperature anomalies traced to heat exchanger performance degradation and cooling system optimization needs.',
  },
  {
    id: '3',
    title: 'Quality Control Deviation Study',
    date: '2024-01-10',
    dataset: 'QualityMetrics.json',
    rootCause: 'Raw material composition variance beyond specifications',
    status: 'in-progress',
    severity: 'medium',
    correctiveActions: 2,
    summary: 'Ongoing investigation into quality control deviations with focus on upstream material sourcing and testing protocols.',
  },
];

export default function AnalysisResults() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<RCAReport | null>(null);

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.rootCause.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || report.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'in-progress': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'draft': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const exportReport = (report: RCAReport, format: 'pdf' | 'excel' | 'word') => {
    // Simulate export functionality
    console.log(`Exporting ${report.title} as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analysis Results</h1>
          <p className="text-gray-400 mt-1">View and manage your RCA reports and findings</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">{filteredReports.length} reports</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="draft">Draft</option>
        </select>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Severity</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Reports Grid */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{report.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(report.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{report.dataset}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                      {report.status.replace('-', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(report.severity)}`}>
                      {report.severity} severity
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-white mb-1">Root Cause Summary</h4>
                <p className="text-sm text-gray-300">{report.rootCause}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-400">{report.summary}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>{report.correctiveActions} actions</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <div className="relative group">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <button
                        onClick={() => exportReport(report, 'pdf')}
                        className="block w-full text-left px-3 py-1 text-sm text-gray-300 hover:bg-gray-700 whitespace-nowrap"
                      >
                        Export as PDF
                      </button>
                      <button
                        onClick={() => exportReport(report, 'excel')}
                        className="block w-full text-left px-3 py-1 text-sm text-gray-300 hover:bg-gray-700 whitespace-nowrap"
                      >
                        Export as Excel
                      </button>
                      <button
                        onClick={() => exportReport(report, 'word')}
                        className="block w-full text-left px-3 py-1 text-sm text-gray-300 hover:bg-gray-700 whitespace-nowrap"
                      >
                        Export as Word
                      </button>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No reports found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || statusFilter !== 'all' || severityFilter !== 'all'
              ? 'Try adjusting your search criteria or filters'
              : 'Upload data and run analysis to generate your first RCA report'
            }
          </p>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{selectedReport.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{new Date(selectedReport.date).toLocaleDateString()}</span>
                    <span>{selectedReport.dataset}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowUpRight className="w-6 h-6 transform rotate-45" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Incident Summary */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Incident Summary</h3>
                <p className="text-gray-300">{selectedReport.summary}</p>
              </div>

              {/* Primary Root Cause */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Primary Root Cause</h3>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-300">{selectedReport.rootCause}</p>
                </div>
              </div>

              {/* Export Options */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => exportReport(selectedReport, 'pdf')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Export PDF
                </button>
                <button
                  onClick={() => exportReport(selectedReport, 'excel')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Export Excel
                </button>
                <button
                  onClick={() => exportReport(selectedReport, 'word')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Export Word
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}