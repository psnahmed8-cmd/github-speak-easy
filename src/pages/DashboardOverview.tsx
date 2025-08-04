import React from 'react';
import { Upload, FileText, BarChart3, Clock, CheckCircle, ArrowUpRight, Lightbulb, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      name: 'Total Analyses',
      value: '0',
      subtext: 'RCA reports generated',
      icon: FileText,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      name: 'Active Projects',
      value: '0',
      subtext: 'Ongoing investigations',
      icon: ArrowUpRight,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      name: 'Issues Resolved',
      value: '0',
      subtext: 'Problems solved',
      icon: CheckCircle,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      name: 'Time Saved',
      value: '0h',
      subtext: 'Through automation',
      icon: Clock,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
  ];

  const quickActions = [
    {
      title: 'Upload Process Data',
      description: 'Start a new root cause analysis by uploading your data files',
      icon: Upload,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => navigate('/upload'),
    },
    {
      title: 'View Analysis Results',
      description: 'Review your previous RCA reports and findings',
      icon: FileText,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => navigate('/analysis'),
    },
    {
      title: 'Explore Chart Views',
      description: 'Visualize data with Fishbone, Pareto, and other diagrams',
      icon: BarChart3,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => navigate('/charts'),
    },
  ];

  const aiTips = [
    "Use descriptive incident titles for better AI analysis",
    "Include process parameters and environmental conditions in your data",
    "Combine multiple data sources for more comprehensive analysis",
    "Regular RCA sessions improve process reliability by 40%",
    "Document corrective actions to prevent recurring issues",
  ];

  const [currentTip, setCurrentTip] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % aiTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name}!</h1>
            <p className="text-gray-300 mt-1">Ready to dive into some root cause analysis? Let's solve problems together.</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.subtext}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-300 mt-2">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <button
            key={action.title}
            onClick={action.action}
            className={`${action.color} rounded-xl p-6 text-left transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <action.icon className="w-6 h-6 text-white" />
              <ArrowUpRight className="w-4 h-4 text-white opacity-60" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
            <p className="text-gray-200 text-sm">{action.description}</p>
          </button>
        ))}
      </div>

      {/* AI Assistant and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Assistant Tip */}
        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">AI Assistant Tip of the Day</h3>
          </div>
          <p className="text-gray-300">{aiTips[currentTip]}</p>
          <div className="flex space-x-1 mt-4">
            {aiTips.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentTip ? 'bg-purple-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Recent RCA Activity</h3>
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">No recent activity</p>
            <p className="text-sm text-gray-500">Upload your first dataset to get started</p>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Getting Started with RootPilot</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white text-sm font-semibold">
              1
            </div>
            <div>
              <h4 className="text-white font-medium">Upload Your Data</h4>
              <p className="text-gray-400 text-sm">Import CSV, Excel, or JSON files with your process data</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full text-white text-sm font-semibold">
              2
            </div>
            <div>
              <h4 className="text-white font-medium">AI Analysis</h4>
              <p className="text-gray-400 text-sm">Let our AI identify root causes and contributing factors</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-full text-white text-sm font-semibold">
              3
            </div>
            <div>
              <h4 className="text-white font-medium">Take Action</h4>
              <p className="text-gray-400 text-sm">Implement suggested corrective actions and prevent recurrence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}