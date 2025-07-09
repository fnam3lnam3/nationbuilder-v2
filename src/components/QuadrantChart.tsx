import React from 'react';
import { BarChart3, TrendingUp, Shield, PieChart } from 'lucide-react';

interface QuadrantChartProps {
  metrics: {
    resourceEfficiency: number;
    rightsProtection: number;
    adaptability: number;
    socialCohesion: number;
    economicGrowth: number;
    sustainability: number;
  };
}

export default function QuadrantChart({ metrics }: QuadrantChartProps) {
  // Calculate quadrant positions (0-100 scale)
  const xAxis = (metrics.resourceEfficiency + metrics.economicGrowth) / 2; // Economic Performance
  const yAxis = (metrics.rightsProtection + metrics.socialCohesion) / 2; // Social Stability
  
  // Additional metrics for visualization
  const adaptabilitySize = Math.max(8, metrics.adaptability / 5); // Size of the dot
  const sustainabilityOpacity = metrics.sustainability / 100; // Opacity based on sustainability

  const getQuadrantLabel = (x: number, y: number) => {
    if (x >= 50 && y >= 50) return 'Prosperous Democracy';
    if (x >= 50 && y < 50) return 'Economic Powerhouse';
    if (x < 50 && y >= 50) return 'Social Haven';
    return 'Developing Nation';
  };

  const getQuadrantColor = (x: number, y: number) => {
    if (x >= 50 && y >= 50) return 'text-green-600';
    if (x >= 50 && y < 50) return 'text-blue-600';
    if (x < 50 && y >= 50) return 'text-purple-600';
    return 'text-orange-600';
  };

  const quadrantLabel = getQuadrantLabel(xAxis, yAxis);
  const quadrantColor = getQuadrantColor(xAxis, yAxis);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <BarChart3 className="h-5 w-5 text-blue-600" />
        <span>Nation Performance Quadrant</span>
      </h3>
      
      <div className="relative">
        {/* Chart Container */}
        <div className="relative w-full h-80 bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden">
          {/* Grid Lines */}
          <div className="absolute inset-0">
            {/* Vertical center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300"></div>
            {/* Horizontal center line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
            
            {/* Quarter lines */}
            <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-200"></div>
            <div className="absolute left-3/4 top-0 bottom-0 w-px bg-gray-200"></div>
            <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-200"></div>
            <div className="absolute top-3/4 left-0 right-0 h-px bg-gray-200"></div>
          </div>

          {/* Quadrant Labels */}
          <div className="absolute top-2 left-2 text-xs font-medium text-purple-600 bg-white px-2 py-1 rounded shadow-sm">
            Social Haven
          </div>
          <div className="absolute top-2 right-2 text-xs font-medium text-green-600 bg-white px-2 py-1 rounded shadow-sm">
            Prosperous Democracy
          </div>
          <div className="absolute bottom-2 left-2 text-xs font-medium text-orange-600 bg-white px-2 py-1 rounded shadow-sm">
            Developing Nation
          </div>
          <div className="absolute bottom-2 right-2 text-xs font-medium text-blue-600 bg-white px-2 py-1 rounded shadow-sm">
            Economic Powerhouse
          </div>

          {/* Nation Position Dot */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
            style={{
              left: `${xAxis}%`,
              bottom: `${yAxis}%`,
              width: `${adaptabilitySize}px`,
              height: `${adaptabilitySize}px`,
              backgroundColor: `rgba(59, 130, 246, ${sustainabilityOpacity})`,
              borderColor: 'white'
            }}
          >
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>

          {/* Axis Labels */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 text-xs font-medium text-gray-600">
            Economic Performance →
          </div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 -rotate-90 text-xs font-medium text-gray-600">
            Social Stability →
          </div>
        </div>

        {/* Legend and Metrics */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Position Metrics</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Economic Performance:</span>
                <span className="font-medium">{Math.round(xAxis)}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Social Stability:</span>
                <span className="font-medium">{Math.round(yAxis)}/100</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Visual Indicators</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Dot Size (Adaptability):</span>
                <span className="font-medium">{metrics.adaptability}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Opacity (Sustainability):</span>
                <span className="font-medium">{metrics.sustainability}/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Quadrant */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${quadrantColor.replace('text-', 'bg-')}`}></div>
            <span className="font-medium text-gray-800">Your Nation Classification:</span>
            <span className={`font-bold ${quadrantColor}`}>{quadrantLabel}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {quadrantLabel === 'Prosperous Democracy' && 'High economic performance with strong social stability - the ideal balance.'}
            {quadrantLabel === 'Economic Powerhouse' && 'Strong economy but may need to focus on social cohesion and rights protection.'}
            {quadrantLabel === 'Social Haven' && 'Excellent social stability but economic growth could be improved.'}
            {quadrantLabel === 'Developing Nation' && 'Opportunities for growth in both economic and social dimensions.'}
          </p>
        </div>

        {/* Detailed Breakdown */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-1 mb-1">
              <BarChart3 className="h-3 w-3 text-blue-600" />
              <span className="font-medium text-blue-800">Economic</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Resource Efficiency:</span>
                <span className="font-medium">{metrics.resourceEfficiency}</span>
              </div>
              <div className="flex justify-between">
                <span>Economic Growth:</span>
                <span className="font-medium">{metrics.economicGrowth}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center space-x-1 mb-1">
              <Shield className="h-3 w-3 text-green-600" />
              <span className="font-medium text-green-800">Social</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Rights Protection:</span>
                <span className="font-medium">{metrics.rightsProtection}</span>
              </div>
              <div className="flex justify-between">
                <span>Social Cohesion:</span>
                <span className="font-medium">{metrics.socialCohesion}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center space-x-1 mb-1">
              <TrendingUp className="h-3 w-3 text-purple-600" />
              <span className="font-medium text-purple-800">Future</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Adaptability:</span>
                <span className="font-medium">{metrics.adaptability}</span>
              </div>
              <div className="flex justify-between">
                <span>Sustainability:</span>
                <span className="font-medium">{metrics.sustainability}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}