import React, { useState, useEffect } from 'react';
import { Swords, Download, X, Plus, Trash2, BarChart3, TrendingUp, Shield, Globe } from 'lucide-react';
import { SavedNation, AssessmentData } from '../types';
import { calculateUtopianScore, calculateDystopianScore, calculateMartianScore } from '../utils/leaderboard';
import { getArchetypeNations, getMostDissimilarArchetype } from '../utils/archetypeNations';
import { parseSharedNationFromUrl } from '../utils/shareUtils';

interface NationVsNationProps {
  userNations: SavedNation[];
  onClose: () => void;
}

interface ComparisonNation {
  id: string;
  name: string;
  type: 'user' | 'archetype' | 'shared';
  assessmentData: AssessmentData;
  customPolicies?: any;
  source?: string; // For archetype nations
}

interface ComparisonMetrics {
  resourceEfficiency: number;
  rightsProtection: number;
  adaptability: number;
  socialCohesion: number;
  economicGrowth: number;
  sustainability: number;
  utopianScore: number;
  dystopianScore: number;
  martianScore: number;
}

export default function NationVsNation({ userNations, onClose }: NationVsNationProps) {
  const [selectedNations, setSelectedNations] = useState<ComparisonNation[]>([]);
  const [shareUrl, setShareUrl] = useState('');
  const [loadingShare, setLoadingShare] = useState(false);
  const [archetypeNations, setArchetypeNations] = useState<ComparisonNation[]>([]);

  useEffect(() => {
    // Load archetype nations
    const archetypes = getArchetypeNations();
    setArchetypeNations(archetypes.map(arch => ({
      id: arch.id,
      name: arch.name,
      type: 'archetype',
      assessmentData: arch.assessmentData,
      customPolicies: arch.customPolicies,
      source: arch.source
    })));
  }, []);

  const calculateMetrics = (data: AssessmentData): ComparisonMetrics => {
    // Mock metrics calculation - in real app this would use the same logic as ResultsDashboard
    const baseEfficiency = Math.min(90, (data.resources * 8) + (data.technologyLevel * 5) + (data.educationLevel * 3));
    const baseRights = Math.min(95, (data.educationLevel * 7) + (data.technologyLevel * 4) + (data.religiousDiversity * 3));
    const baseAdaptability = Math.min(88, (data.technologyLevel * 8) + (data.educationLevel * 5) + (data.resources * 2));
    const baseCohesion = Math.min(92, (100 - data.religiousDiversity * 5) + (data.educationLevel * 4) + (data.languages <= 3 ? 20 : 0));

    return {
      resourceEfficiency: baseEfficiency,
      rightsProtection: baseRights,
      adaptability: baseAdaptability,
      socialCohesion: baseCohesion,
      economicGrowth: Math.min(85, baseEfficiency * 0.8 + baseAdaptability * 0.2),
      sustainability: Math.min(90, baseEfficiency * 0.6 + baseAdaptability * 0.4),
      utopianScore: calculateUtopianScore(data),
      dystopianScore: calculateDystopianScore(data),
      martianScore: calculateMartianScore(data)
    };
  };

  const addUserNation = (nation: SavedNation) => {
    if (selectedNations.length >= 3) return;
    
    const comparisonNation: ComparisonNation = {
      id: nation.id,
      name: nation.name,
      type: 'user',
      assessmentData: nation.assessmentData,
      customPolicies: nation.customPolicies
    };
    
    setSelectedNations(prev => [...prev, comparisonNation]);
  };

  const addArchetypeNation = (archetype: ComparisonNation) => {
    if (selectedNations.length >= 3) return;
    setSelectedNations(prev => [...prev, archetype]);
  };

  const addSimilarArchetype = (baseNation: SavedNation) => {
    if (selectedNations.length >= 3) return;
    
    const similar = getArchetypeNations().find(arch => 
      arch.assessmentData.politicalStructure === baseNation.assessmentData.politicalStructure ||
      arch.assessmentData.economicModel === baseNation.assessmentData.economicModel
    );
    
    if (similar) {
      addArchetypeNation({
        id: similar.id,
        name: `${similar.name} (Similar)`,
        type: 'archetype',
        assessmentData: similar.assessmentData,
        customPolicies: similar.customPolicies,
        source: similar.source
      });
    }
  };

  const addDissimilarArchetype = (baseNation: SavedNation) => {
    if (selectedNations.length >= 3) return;
    
    const dissimilar = getMostDissimilarArchetype(baseNation.assessmentData);
    if (dissimilar) {
      addArchetypeNation({
        id: dissimilar.id,
        name: `${dissimilar.name} (Opposite)`,
        type: 'archetype',
        assessmentData: dissimilar.assessmentData,
        customPolicies: dissimilar.customPolicies,
        source: dissimilar.source
      });
    }
  };

  const addSharedNation = async () => {
    if (selectedNations.length >= 3 || !shareUrl.trim()) return;
    
    setLoadingShare(true);
    try {
      const sharedNation = await parseSharedNationFromUrl(shareUrl.trim());
      if (sharedNation) {
        const comparisonNation: ComparisonNation = {
          id: `shared-${Date.now()}`,
          name: `${sharedNation.name} (Shared)`,
          type: 'shared',
          assessmentData: sharedNation.assessmentData,
          customPolicies: sharedNation.customPolicies
        };
        
        setSelectedNations(prev => [...prev, comparisonNation]);
        setShareUrl('');
      } else {
        alert('Invalid share link. Please check the URL and try again.');
      }
    } catch (error) {
      console.error('Error parsing shared nation:', error);
      alert('Failed to load shared nation. Please check the link and try again.');
    } finally {
      setLoadingShare(false);
    }
  };

  const removeNation = (id: string) => {
    setSelectedNations(prev => prev.filter(n => n.id !== id));
  };

  const downloadComparison = () => {
    if (selectedNations.length === 0) return;

    const metrics = selectedNations.map(nation => ({
      nation,
      metrics: calculateMetrics(nation.assessmentData)
    }));

    let content = 'NATION VS NATION COMPARISON REPORT\n';
    content += '=' .repeat(50) + '\n\n';

    // Summary table
    content += 'COMPARISON SUMMARY\n';
    content += '-'.repeat(30) + '\n';
    content += 'Nation'.padEnd(25) + 'Type'.padEnd(12) + 'Utopian'.padEnd(10) + 'Dystopian'.padEnd(12) + 'Martian\n';
    content += '-'.repeat(70) + '\n';
    
    metrics.forEach(({ nation, metrics: m }) => {
      content += nation.name.padEnd(25) + 
                 nation.type.padEnd(12) + 
                 m.utopianScore.toString().padEnd(10) + 
                 m.dystopianScore.toString().padEnd(12) + 
                 m.martianScore.toString() + '\n';
    });

    content += '\n\nDETAILED METRICS COMPARISON\n';
    content += '=' .repeat(50) + '\n';

    const metricNames = [
      'Resource Efficiency',
      'Rights Protection', 
      'Adaptability',
      'Social Cohesion',
      'Economic Growth',
      'Sustainability'
    ];

    metricNames.forEach(metricName => {
      content += `\n${metricName.toUpperCase()}\n`;
      content += '-'.repeat(metricName.length) + '\n';
      
      metrics.forEach(({ nation, metrics: m }) => {
        const value = metricName === 'Resource Efficiency' ? m.resourceEfficiency :
                     metricName === 'Rights Protection' ? m.rightsProtection :
                     metricName === 'Adaptability' ? m.adaptability :
                     metricName === 'Social Cohesion' ? m.socialCohesion :
                     metricName === 'Economic Growth' ? m.economicGrowth :
                     m.sustainability;
        
        content += `${nation.name}: ${value}/100\n`;
      });
    });

    // Basic nation info
    content += '\n\nNATION DETAILS\n';
    content += '=' .repeat(50) + '\n';

    selectedNations.forEach(nation => {
      content += `\n${nation.name.toUpperCase()}\n`;
      content += '-'.repeat(nation.name.length) + '\n';
      content += `Population: ${nation.assessmentData.population.toLocaleString()}\n`;
      content += `Territory: ${nation.assessmentData.territory.toLocaleString()} km²\n`;
      content += `Location: ${nation.assessmentData.location}\n`;
      content += `Political System: ${nation.assessmentData.politicalStructure}\n`;
      content += `Economic Model: ${nation.assessmentData.economicModel}\n`;
      content += `Social Organization: ${Array.isArray(nation.assessmentData.socialOrganization) ? 
        nation.assessmentData.socialOrganization.join(', ') : nation.assessmentData.socialOrganization}\n`;
      
      if (nation.source) {
        content += `Source: ${nation.source}\n`;
      }
    });

    content += '\n\nGenerated by Nationbuilder - Nation vs Nation Comparison Tool\n';
    content += `Report Date: ${new Date().toLocaleString()}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nation-comparison.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-blue-100 text-blue-800';
      case 'archetype': return 'bg-green-100 text-green-800';
      case 'shared': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <Globe className="h-3 w-3" />;
      case 'archetype': return <BarChart3 className="h-3 w-3" />;
      case 'shared': return <TrendingUp className="h-3 w-3" />;
      default: return <Shield className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Swords className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Nation vs Nation</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={downloadComparison}
            disabled={selectedNations.length === 0}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          Compare up to 3 nations side-by-side. Select from your saved nations, historical archetypes, 
          or add nations shared by other users via share links.
        </p>
      </div>

      {/* Selected Nations for Comparison */}
      {selectedNations.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Selected for Comparison ({selectedNations.length}/3)</h3>
          
          <div className="space-y-3 mb-6">
            {selectedNations.map(nation => (
              <div key={nation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(nation.type)}`}>
                    {getTypeIcon(nation.type)}
                    <span>{nation.type}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{nation.name}</div>
                    <div className="text-sm text-gray-500">
                      Pop: {nation.assessmentData.population.toLocaleString()} • 
                      {nation.assessmentData.politicalStructure}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeNation(nation.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-900">Metric</th>
                  {selectedNations.map(nation => (
                    <th key={nation.id} className="text-center py-2 font-medium text-gray-900 min-w-[120px]">
                      {nation.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { key: 'resourceEfficiency', label: 'Resource Efficiency' },
                  { key: 'rightsProtection', label: 'Rights Protection' },
                  { key: 'adaptability', label: 'Adaptability' },
                  { key: 'socialCohesion', label: 'Social Cohesion' },
                  { key: 'economicGrowth', label: 'Economic Growth' },
                  { key: 'sustainability', label: 'Sustainability' },
                  { key: 'utopianScore', label: 'Utopian Score' },
                  { key: 'dystopianScore', label: 'Dystopian Score' },
                  { key: 'martianScore', label: 'Martian Score' }
                ].map(metric => {
                  const values = selectedNations.map(nation => {
                    const metrics = calculateMetrics(nation.assessmentData);
                    return metrics[metric.key as keyof ComparisonMetrics];
                  });
                  const maxValue = Math.max(...values);
                  
                  return (
                    <tr key={metric.key}>
                      <td className="py-2 font-medium text-gray-700">{metric.label}</td>
                      {selectedNations.map((nation, index) => {
                        const value = values[index];
                        const isHighest = value === maxValue && selectedNations.length > 1;
                        return (
                          <td key={nation.id} className="text-center py-2">
                            <span className={`font-medium ${isHighest ? 'text-green-600 font-bold' : 'text-gray-900'}`}>
                              {value}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Nations Section */}
      {selectedNations.length < 3 && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Your Nations */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Saved Nations</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {userNations.filter(nation => !selectedNations.find(s => s.id === nation.id)).map(nation => (
                <div key={nation.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{nation.name}</div>
                    <div className="text-sm text-gray-500">
                      {nation.assessmentData.politicalStructure} • {nation.assessmentData.economicModel}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => addUserNation(nation)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                      title="Add to comparison"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => addSimilarArchetype(nation)}
                      className="text-green-600 hover:text-green-700 p-1 text-xs"
                      title="Add similar archetype"
                    >
                      Similar
                    </button>
                    <button
                      onClick={() => addDissimilarArchetype(nation)}
                      className="text-red-600 hover:text-red-700 p-1 text-xs"
                      title="Add opposite archetype"
                    >
                      Opposite
                    </button>
                  </div>
                </div>
              ))}
              {userNations.length === 0 && (
                <p className="text-gray-500 text-center py-4">No saved nations yet</p>
              )}
            </div>
          </div>

          {/* Archetype & Shared Nations */}
          <div className="space-y-6">
            {/* Historical Archetypes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Historical Archetypes</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {archetypeNations.map(archetype => (
                  <div key={archetype.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{archetype.name}</div>
                      <div className="text-xs text-gray-500">{archetype.source}</div>
                    </div>
                    <button
                      onClick={() => addArchetypeNation(archetype)}
                      className="text-green-600 hover:text-green-700 p-1"
                      title="Add to comparison"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Shared Nations */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Add Shared Nation</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={shareUrl}
                  onChange={(e) => setShareUrl(e.target.value)}
                  placeholder="Paste share link from another user..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={addSharedNation}
                  disabled={!shareUrl.trim() || loadingShare}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  {loadingShare ? 'Loading...' : 'Add Shared Nation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}