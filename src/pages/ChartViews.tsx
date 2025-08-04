import React, { useState } from 'react';
import { BarChart3, Maximize2, Download, RefreshCw, Filter, Layers } from 'lucide-react';

type ChartType = 'fishbone' | 'pareto' | 'fivewhys' | 'heatmap';

interface ChartConfig {
  id: ChartType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const chartConfigs: ChartConfig[] = [
  {
    id: 'fishbone',
    title: 'Fishbone (Ishikawa) Diagram',
    description: 'Identify root causes across different categories',
    icon: <Layers className="w-6 h-6" />
  },
  {
    id: 'pareto',
    title: 'Pareto Chart',
    description: 'Prioritize issues by frequency and impact',
    icon: <BarChart3 className="w-6 h-6" />
  },
  {
    id: 'fivewhys',
    title: '5 Whys Chain',
    description: 'Drill down to fundamental root causes',
    icon: <RefreshCw className="w-6 h-6" />
  },
  {
    id: 'heatmap',
    title: 'Root Cause Heatmap',
    description: 'Visualize cause frequency and severity',
    icon: <Filter className="w-6 h-6" />
  }
];

export default function ChartViews() {
  const [activeChart, setActiveChart] = useState<ChartType>('fishbone');
  const [fullScreen, setFullScreen] = useState(false);

  const exportChart = (format: 'png' | 'pdf' | 'svg') => {
    console.log(`Exporting ${activeChart} chart as ${format.toUpperCase()}`);
  };

  const renderFishboneChart = () => (
    <div className="flex items-center justify-center h-96 bg-gray-900/50 rounded-lg border border-gray-700">
      <div className="relative w-full max-w-4xl">
        {/* Main spine */}
        <div className="absolute top-1/2 left-0 right-20 h-0.5 bg-white transform -translate-y-0.5"></div>
        
        {/* Problem box */}
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-red-500/20 border border-red-500 rounded-lg p-4">
          <p className="text-white font-semibold">Pump Failure</p>
        </div>

        {/* Categories */}
        <div className="absolute top-8 left-1/4 transform -translate-x-1/2">
          <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-3 mb-2">
            <p className="text-white font-medium">Methods</p>
          </div>
          <div className="w-0.5 h-16 bg-white mx-auto"></div>
          <div className="w-16 h-0.5 bg-white"></div>
        </div>

        <div className="absolute top-8 right-1/4 transform translate-x-1/2">
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 mb-2">
            <p className="text-white font-medium">Materials</p>
          </div>
          <div className="w-0.5 h-16 bg-white mx-auto"></div>
          <div className="w-16 h-0.5 bg-white"></div>
        </div>

        <div className="absolute bottom-8 left-1/4 transform -translate-x-1/2">
          <div className="w-16 h-0.5 bg-white mb-16"></div>
          <div className="w-0.5 h-16 bg-white mx-auto"></div>
          <div className="bg-purple-500/20 border border-purple-500 rounded-lg p-3">
            <p className="text-white font-medium">Maintenance</p>
          </div>
        </div>

        <div className="absolute bottom-8 right-1/4 transform translate-x-1/2">
          <div className="w-16 h-0.5 bg-white mb-16"></div>
          <div className="w-0.5 h-16 bg-white mx-auto"></div>
          <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-3">
            <p className="text-white font-medium">Environment</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderParetoChart = () => (
    <div className="h-96 bg-gray-900/50 rounded-lg border border-gray-700 p-6">
      <div className="flex items-end justify-center space-x-2 h-full">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 bg-red-500 rounded-t" style={{ height: '80%' }}></div>
          <p className="text-xs text-gray-400 text-center">Lubrication Issues</p>
          <p className="text-xs text-white font-medium">45%</p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 bg-orange-500 rounded-t" style={{ height: '60%' }}></div>
          <p className="text-xs text-gray-400 text-center">Vibration</p>
          <p className="text-xs text-white font-medium">25%</p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 bg-yellow-500 rounded-t" style={{ height: '40%' }}></div>
          <p className="text-xs text-gray-400 text-center">Temperature</p>
          <p className="text-xs text-white font-medium">15%</p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 bg-green-500 rounded-t" style={{ height: '30%' }}></div>
          <p className="text-xs text-gray-400 text-center">Pressure</p>
          <p className="text-xs text-white font-medium">10%</p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 bg-blue-500 rounded-t" style={{ height: '20%' }}></div>
          <p className="text-xs text-gray-400 text-center">Other</p>
          <p className="text-xs text-white font-medium">5%</p>
        </div>
      </div>
    </div>
  );

  const renderFiveWhysChart = () => (
    <div className="h-96 bg-gray-900/50 rounded-lg border border-gray-700 p-6 overflow-auto">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
          <div className="bg-gray-800 rounded-lg p-4 flex-1">
            <p className="text-white font-medium">Why did the pump fail?</p>
            <p className="text-gray-400 text-sm mt-1">Because the bearings seized due to lack of lubrication</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 ml-8">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
          <div className="bg-gray-800 rounded-lg p-4 flex-1">
            <p className="text-white font-medium">Why was there lack of lubrication?</p>
            <p className="text-gray-400 text-sm mt-1">Because the lubrication schedule was not followed</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 ml-16">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
          <div className="bg-gray-800 rounded-lg p-4 flex-1">
            <p className="text-white font-medium">Why wasn't the schedule followed?</p>
            <p className="text-gray-400 text-sm mt-1">Because maintenance staff were understaffed during peak season</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 ml-24">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">4</div>
          <div className="bg-gray-800 rounded-lg p-4 flex-1">
            <p className="text-white font-medium">Why were they understaffed?</p>
            <p className="text-gray-400 text-sm mt-1">Because no temporary workers were hired for seasonal demand</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 ml-32">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">5</div>
          <div className="bg-gray-800 rounded-lg p-4 flex-1">
            <p className="text-white font-medium">Why weren't temporary workers hired?</p>
            <p className="text-gray-400 text-sm mt-1">Because seasonal demand fluctuations weren't properly forecasted</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHeatmap = () => (
    <div className="h-96 bg-gray-900/50 rounded-lg border border-gray-700 p-6">
      <div className="grid grid-cols-6 gap-2 h-full">
        {/* Heatmap grid */}
        {Array.from({ length: 42 }, (_, i) => {
          const intensity = Math.random();
          let bgColor = 'bg-gray-700';
          if (intensity > 0.8) bgColor = 'bg-red-500';
          else if (intensity > 0.6) bgColor = 'bg-orange-500';
          else if (intensity > 0.4) bgColor = 'bg-yellow-500';
          else if (intensity > 0.2) bgColor = 'bg-green-500';
          
          return (
            <div
              key={i}
              className={`${bgColor} rounded aspect-square opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
              title={`Cause ${i + 1}: ${Math.round(intensity * 100)}% frequency`}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-400">Low Frequency</p>
        <div className="flex space-x-1">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <div className="w-4 h-4 bg-red-500 rounded"></div>
        </div>
        <p className="text-sm text-gray-400">High Frequency</p>
      </div>
    </div>
  );

  const renderChart = () => {
    switch (activeChart) {
      case 'fishbone': return renderFishboneChart();
      case 'pareto': return renderParetoChart();
      case 'fivewhys': return renderFiveWhysChart();
      case 'heatmap': return renderHeatmap();
      default: return renderFishboneChart();
    }
  };

  const ChartContainer = () => (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 ${fullScreen ? 'fixed inset-4 z-50' : ''}`}>
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {chartConfigs.find(c => c.id === activeChart)?.title}
            </h2>
            <p className="text-gray-400 text-sm">
              {chartConfigs.find(c => c.id === activeChart)?.description}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative group">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={() => exportChart('png')}
                  className="block w-full text-left px-3 py-1 text-sm text-gray-300 hover:bg-gray-700 whitespace-nowrap"
                >
                  Export as PNG
                </button>
                <button
                  onClick={() => exportChart('pdf')}
                  className="block w-full text-left px-3 py-1 text-sm text-gray-300 hover:bg-gray-700 whitespace-nowrap"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => exportChart('svg')}
                  className="block w-full text-left px-3 py-1 text-sm text-gray-300 hover:bg-gray-700 whitespace-nowrap"
                >
                  Export as SVG
                </button>
              </div>
            </div>
            <button
              onClick={() => setFullScreen(!fullScreen)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        {renderChart()}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Chart Views</h1>
        <p className="text-gray-400 mt-1">Visualize your RCA data with interactive diagrams and charts</p>
      </div>

      {!fullScreen && (
        <>
          {/* Chart Type Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {chartConfigs.map((config) => (
              <button
                key={config.id}
                onClick={() => setActiveChart(config.id)}
                className={`p-6 rounded-xl border transition-all text-left ${
                  activeChart === config.id
                    ? 'bg-purple-600/20 border-purple-500 text-white'
                    : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  {config.icon}
                  <h3 className="font-semibold">{config.title}</h3>
                </div>
                <p className="text-sm opacity-80">{config.description}</p>
              </button>
            ))}
          </div>

          {/* Data Source Info */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Current Data Source</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Pump Failure Analysis - Line 3</p>
                <p className="text-gray-400 text-sm">ProcessData_Jan2024.csv • 1,234 records • Last updated: Jan 15, 2024</p>
              </div>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                Change Data Source
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Chart */}
      <ChartContainer />

      {!fullScreen && (
        /* Chart Insights */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Key Insights</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                <p className="text-gray-300">Lubrication issues account for 45% of all pump failures</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <p className="text-gray-300">Vibration-related problems show increasing trend over time</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <p className="text-gray-300">Temperature fluctuations correlate with maintenance schedules</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Recommended Actions</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <p className="text-gray-300">Implement predictive maintenance for lubrication systems</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <p className="text-gray-300">Install continuous vibration monitoring sensors</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <p className="text-gray-300">Review and optimize current maintenance schedules</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}