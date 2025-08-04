import React, { useState } from 'react';
import { Search, Book, MessageCircle, FileText, Video, Download, ExternalLink, ChevronRight, HelpCircle } from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  content: string;
  category: string;
}

const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with RootPilot',
    category: 'basics',
    content: 'Learn the fundamentals of root cause analysis with RootPilot. This guide covers account setup, data upload, and running your first analysis.'
  },
  {
    id: 'data-upload',
    title: 'Uploading Process Data',
    category: 'basics',
    content: 'Understanding supported file formats (CSV, Excel, JSON) and best practices for data preparation and upload.'
  },
  {
    id: 'analysis-types',
    title: 'Types of RCA Analysis',
    category: 'analysis',
    content: 'Explore different analysis methods including Fishbone diagrams, 5 Whys, Pareto analysis, and fault tree analysis.'
  },
  {
    id: 'ai-features',
    title: 'AI-Powered Features',
    category: 'advanced',
    content: 'Leverage artificial intelligence for automated root cause identification, pattern recognition, and predictive insights.'
  },
  {
    id: 'what-if-scenarios',
    title: 'What-If Scenario Modeling',
    category: 'advanced',
    content: 'Create and analyze hypothetical scenarios to predict outcomes and test different operational parameters.'
  },
  {
    id: 'chart-views',
    title: 'Visualization and Charts',
    category: 'analysis',
    content: 'Use interactive charts and diagrams to visualize root causes, including heatmaps, flow charts, and trend analysis.'
  },
  {
    id: 'export-reports',
    title: 'Exporting Reports',
    category: 'basics',
    content: 'Generate and export comprehensive RCA reports in multiple formats (PDF, Excel, Word) for sharing and documentation.'
  },
  {
    id: 'api-integration',
    title: 'API Integration',
    category: 'advanced',
    content: 'Integrate RootPilot with your existing systems using our REST API for automated data synchronization.'
  },
];

const faqs = [
  {
    question: 'What file formats are supported for data upload?',
    answer: 'RootPilot supports CSV, Excel (.xlsx, .xls), and JSON files up to 10MB in size. We recommend CSV format for optimal processing speed.'
  },
  {
    question: 'How accurate is the AI root cause analysis?',
    answer: 'Our AI models achieve 85-90% accuracy in identifying primary root causes, with continuous improvement through machine learning and user feedback.'
  },
  {
    question: 'Can I collaborate with team members on analyses?',
    answer: 'Yes, Professional and Enterprise plans include team collaboration features, allowing you to share analyses and work together on investigations.'
  },
  {
    question: 'How is my data secured?',
    answer: 'All data is encrypted in transit and at rest using AES-256 encryption. We comply with SOC 2 Type II and ISO 27001 security standards.'
  },
  {
    question: 'Can I integrate RootPilot with my existing systems?',
    answer: 'Yes, we provide REST APIs and webhooks for integration with ERP, CMMS, and other industrial systems. Contact support for integration assistance.'
  },
];

export default function HelpDocumentation() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSection, setActiveSection] = useState('getting-started');

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'basics', name: 'Getting Started' },
    { id: 'analysis', name: 'Analysis Methods' },
    { id: 'advanced', name: 'Advanced Features' },
  ];

  const filteredSections = docSections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Help & Documentation</h1>
        <p className="text-gray-400 mt-1">Find guides, tutorials, and support resources</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Video className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Video Tutorials</h3>
          </div>
          <p className="text-gray-300 text-sm mb-4">Watch step-by-step video guides for common tasks and advanced features</p>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1">
            <span>Browse Videos</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <MessageCircle className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Live Support</h3>
          </div>
          <p className="text-gray-300 text-sm mb-4">Chat with our support team for real-time assistance with any questions</p>
          <button className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center space-x-1">
            <span>Start Chat</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Download className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">User Manual</h3>
          </div>
          <p className="text-gray-300 text-sm mb-4">Download the complete RootPilot user manual in PDF format</p>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center space-x-1">
            <span>Download PDF</span>
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      {/* Documentation Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Documentation</h3>
            <nav className="space-y-2">
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-purple-600/20 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">{section.title}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
            {filteredSections.find(s => s.id === activeSection) ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {filteredSections.find(s => s.id === activeSection)?.title}
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {filteredSections.find(s => s.id === activeSection)?.content}
                  </p>
                  
                  {/* Sample detailed content */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Overview</h3>
                      <p className="text-gray-300 mb-4">
                        RootPilot's AI-powered root cause analysis helps you identify the fundamental causes of industrial problems quickly and accurately. Our platform combines traditional RCA methodologies with advanced machine learning to provide insights that would take hours or days to discover manually.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Step-by-Step Guide</h3>
                      <ol className="list-decimal list-inside space-y-2 text-gray-300">
                        <li>Upload your process data using the drag-and-drop interface</li>
                        <li>Review the data validation results and preview</li>
                        <li>Select the analysis type that best fits your investigation</li>
                        <li>Configure analysis parameters and run the AI analysis</li>
                        <li>Review results and generate comprehensive reports</li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Best Practices</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-300">
                        <li>Include timestamp data for temporal analysis</li>
                        <li>Provide detailed incident descriptions</li>
                        <li>Upload multiple data sources when available</li>
                        <li>Use consistent naming conventions for equipment and processes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Book className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No documentation found</h3>
                <p className="text-gray-400">Try adjusting your search terms or category filter</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-700 pb-6 last:border-0 last:pb-0">
              <div className="flex items-start space-x-3">
                <HelpCircle className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Still need help?</h3>
        <p className="text-gray-300 mb-6">Our support team is here to assist you with any questions or issues</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Contact Support</span>
          </button>
          <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors">
            Schedule a Demo
          </button>
        </div>
      </div>
    </div>
  );
}