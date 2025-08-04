import React, { useState } from 'react';
import { Play, RotateCcw, GitCompare as Compare, Settings, TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, number>;
  results?: {
    riskLevel: 'low' | 'medium' | 'high';
    probability: number;
    impact: string;
    recommendations: string[];
  };
}

interface Parameter {
  name: string;
  key: string;
  min: number;
  max: number;
  current: number;
  unit: string;
}

const defaultParameters: Parameter[] = [
  { name: 'Operating Temperature', key: 'temperature', min: 20, max: 150, current: 85, unit: '°C' },
  { name: 'Pressure', key: 'pressure', min: 0, max: 50, current: 25, unit: 'bar' },
  { name: 'Flow Rate', key: 'flowRate', min: 10, max: 200, current: 120, unit: 'L/min' },
  { name: 'Vibration Level', key: 'vibration', min: 0, max: 10, current: 3.2, unit: 'mm/s' },
  { name: 'Maintenance Frequency', key: 'maintenance', min: 1, max: 52, current: 12, unit: 'weeks' },
];

export default function WhatIfScenarios() {
  const [parameters, setParameters] = useState<Parameter[]>(defaultParameters);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);

  const updateParameter = (key: string, value: number) => {
    setParameters(prev => 
      prev.map(param => 
        param.key === key ? { ...param, current: value } : param
      )
    );
  };

  const resetParameters = () => {
    setParameters(defaultParameters);
  };

  const runScenario = async () => {
    setIsRunning(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const parameterValues = parameters.reduce((acc, param) => ({
      ...acc,
      [param.key]: param.current
    }), {});

    const riskScore = calculateRiskScore(parameterValues);
    const riskLevel = riskScore > 0.7 ? 'high' : riskScore > 0.4 ? 'medium' : 'low';
    
    const newScenario: Scenario = {
      id: Date.now().toString(),
      name: `Scenario ${scenarios.length + 1}`,
      description: generateScenarioDescription(parameterValues),
      parameters: parameterValues,
      results: {
        riskLevel,
        probability: Math.round(riskScore * 100),
        impact: generateImpactDescription(riskLevel),
        recommendations: generateRecommendations(parameterValues, riskLevel),
      }
    };

    setScenarios(prev => [newScenario, ...prev]);
    setCurrentScenario(newScenario);
    setIsRunning(false);
  };

  const calculateRiskScore = (params: Record<string, number>): number => {
    let score = 0;
    
    // Temperature risk
    if (params.temperature > 120) score += 0.3;
    else if (params.temperature > 100) score += 0.2;
    
    // Pressure risk
    if (params.pressure > 40) score += 0.25;
    else if (params.pressure > 30) score += 0.15;
    
    // Vibration risk
    if (params.vibration > 7) score += 0.3;
    else if (params.vibration > 5) score += 0.2;
    
    // Maintenance risk
    if (params.maintenance > 24) score += 0.2;
    else if (params.maintenance > 16) score += 0.1;
    
    return Math.min(score, 1);
  };

  const generateScenarioDescription = (params: Record<string, number>): string => {
    return `Operating at ${params.temperature}°C, ${params.pressure} bar pressure, with ${params.maintenance}-week maintenance intervals`;
  };

  const generateImpactDescription = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'high': return 'Potential equipment failure, production downtime, and safety risks';
      case 'medium': return 'Increased maintenance needs and performance degradation';
      case 'low': return 'Normal operation with minimal risks';
      default: return 'Unknown impact';
    }
  };

  const generateRecommendations = (params: Record<string, number>, riskLevel: string): string[] => {
    const recommendations = [];
    
    if (params.temperature > 100) {
      recommendations.push('Implement enhanced cooling systems');
    }
    if (params.pressure > 30) {
      recommendations.push('Review pressure relief valve settings');
    }
    if (params.vibration > 5) {
      recommendations.push('Increase vibration monitoring frequency');
    }
    if (params.maintenance > 16) {
      recommendations.push('Reduce maintenance intervals');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Continue current operating procedures');
    }
    
    return recommendations;
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const toggleScenarioSelection = (id: string) => {
    setSelectedScenarios(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">What-If Scenarios</h1>
          <p className="text-gray-400 mt-1">Simulate different operating conditions and predict outcomes</p>
        </div>
        <div className="flex items-center space-x-3">
          {scenarios.length > 1 && (
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                compareMode 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Compare className="w-4 h-4" />
              <span>Compare</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Parameter Controls */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Simulation Parameters</h2>
              <button
                onClick={resetParameters}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {parameters.map((param) => (
                <div key={param.key}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-white">{param.name}</label>
                    <span className="text-sm text-gray-400">
                      {param.current} {param.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={(param.max - param.min) / 100}
                    value={param.current}
                    onChange={(e) => updateParameter(param.key, parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{param.min}</span>
                    <span>{param.max}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={runScenario}
              disabled={isRunning}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Running Analysis...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Run Scenario</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {currentScenario?.results ? (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-lg font-semibold text-white mb-6">Scenario Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(currentScenario.results.riskLevel)}`}>
                    {currentScenario.results.riskLevel === 'high' && <AlertTriangle className="w-4 h-4 mr-1" />}
                    {currentScenario.results.riskLevel === 'low' && <CheckCircle className="w-4 h-4 mr-1" />}
                    {currentScenario.results.riskLevel.toUpperCase()} RISK
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">{currentScenario.results.probability}%</p>
                  <p className="text-sm text-gray-400">Failure Probability</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-white">Impact Assessment</p>
                  <p className="text-sm text-gray-400">{currentScenario.results.impact}</p>
                </div>
                <div className="text-center">
                  <Settings className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-white">Actions Required</p>
                  <p className="text-sm text-gray-400">{currentScenario.results.recommendations.length} recommendations</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">AI Recommendations</h3>
                <div className="space-y-3">
                  {currentScenario.results.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <ArrowRight className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-300">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700/50 text-center">
              <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Ready to Simulate</h3>
              <p className="text-gray-400">Adjust the parameters on the left and run your first scenario analysis</p>
            </div>
          )}
        </div>
      </div>

      {/* Scenario History */}
      {scenarios.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Scenario History</h2>
            {compareMode && (
              <p className="text-sm text-gray-400">
                Select scenarios to compare ({selectedScenarios.length} selected)
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className={`bg-gray-700/50 rounded-lg p-4 cursor-pointer transition-all ${
                  compareMode && selectedScenarios.includes(scenario.id)
                    ? 'ring-2 ring-purple-500 bg-purple-500/10'
                    : 'hover:bg-gray-700/70'
                }`}
                onClick={() => {
                  if (compareMode) {
                    toggleScenarioSelection(scenario.id);
                  } else {
                    setCurrentScenario(scenario);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{scenario.name}</h3>
                  {scenario.results && (
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(scenario.results.riskLevel)}`}>
                      {scenario.results.riskLevel}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-3">{scenario.description}</p>
                {scenario.results && (
                  <p className="text-sm text-gray-300">
                    {scenario.results.probability}% failure probability
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}