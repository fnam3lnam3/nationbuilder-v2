import React, { useState, useEffect } from 'react';
import { Globe, Calendar, Trash2, Edit, Eye, Share2, Copy, Check, Users, Swords, Crown, AlertTriangle } from 'lucide-react';
import { SavedNation } from '../types';
import { toggleLeaderboardVisibility, checkLeaderboardVisibility } from '../utils/leaderboard';
import NationVsNation from './NationVsNation';

interface SavedNationsProps {
  nations: SavedNation[];
  onLoad: (nation: SavedNation) => void;
  onDelete: (nationId: string) => void;
  onEdit: (nation: SavedNation) => void;
  user?: any;
  subscription?: any;
}

export default function SavedNations({ 
  nations, 
  onLoad, 
  onDelete, 
  onEdit, 
  user, 
  subscription 
}: SavedNationsProps) {
  const [copiedNationId, setCopiedNationId] = useState<string | null>(null);
  const [leaderboardVisibility, setLeaderboardVisibility] = useState<Record<string, boolean>>({});
  const [loadingVisibility, setLoadingVisibility] = useState<string | null>(null);
  const [showNationVsNation, setShowNationVsNation] = useState(false);

  const isPremium = subscription?.subscription_status === 'active';
  const maxNations = isPremium ? 30 : 5;

  // Load leaderboard visibility status for all nations
  useEffect(() => {
    const loadVisibilityStatus = async () => {
      if (!user) return;
      
      const visibilityMap: Record<string, boolean> = {};
      for (const nation of nations) {
        try {
          const isVisible = await checkLeaderboardVisibility(nation.id);
          visibilityMap[nation.id] = isVisible;
        } catch (error) {
          console.error(`Error checking visibility for nation ${nation.id}:`, error);
          visibilityMap[nation.id] = false;
        }
      }
      setLeaderboardVisibility(visibilityMap);
    };

    if (nations.length > 0 && user) {
      loadVisibilityStatus();
    }
  }, [nations, user]);

  const handleDelete = (nationId: string, nationName: string) => {
    if (window.confirm(`Are you sure you want to delete "${nationName}"? This action cannot be undone.`)) {
      onDelete(nationId);
    }
  };

  const handleShare = async (nation: SavedNation) => {
    try {
      // Create a shareable link with nation data encoded
      const shareData = {
        name: nation.name,
        assessmentData: nation.assessmentData,
        customPolicies: nation.customPolicies,
        createdAt: nation.createdAt
      };
      
      const encodedData = btoa(JSON.stringify(shareData));
      const shareUrl = `${window.location.origin}?shared=${encodedData}`;
      
      await navigator.clipboard.writeText(shareUrl);
      setCopiedNationId(nation.id);
      
      setTimeout(() => {
        setCopiedNationId(null);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to copy share link:', error);
      alert('Failed to copy share link. Please try again.');
    }
  };

  const handleTogglePublicVisibility = async (nation: SavedNation) => {
    if (!user) {
      alert('Please log in to manage leaderboard visibility.');
      return;
    }

    setLoadingVisibility(nation.id);
    try {
      const newVisibility = await toggleLeaderboardVisibility(nation.id);
      setLeaderboardVisibility(prev => ({
        ...prev,
        [nation.id]: newVisibility
      }));
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      alert('Failed to update visibility. Please try again.');
    } finally {
      setLoadingVisibility(null);
    }
  };

  if (nations.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Nations</h3>
        <p className="text-gray-600 mb-4">Create your first nation to get started!</p>
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-blue-800 text-sm">
              <strong>Sign in</strong> to save up to {maxNations} nations and access premium features.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {showNationVsNation ? (
        <NationVsNation 
          userNations={nations}
          onClose={() => setShowNationVsNation(false)}
        />
      ) : (
        <>
          {/* Nation vs Nation Feature Button */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Swords className="h-8 w-8 text-white" />
                <div>
                  <h3 className="text-xl font-bold text-white">Nation vs Nation</h3>
                  <p className="text-blue-100 text-sm">
                    Compare your nations with historical archetypes and other users' creations
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNationVsNation(true)}
                disabled={nations.length === 0}
                className="bg-white hover:bg-gray-100 disabled:opacity-50 text-blue-600 font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Start Comparison
              </button>
            </div>
          </div>

          {/* Nations List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Saved Nations ({nations.length}/{maxNations})
              </h3>
              {!isPremium && nations.length >= 5 && (
                <div className="flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                  <Crown className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-800 text-sm font-medium">
                    Upgrade to save up to 30 nations
                  </span>
                </div>
              )}
            </div>

            <div className="grid gap-4">
              {nations.map((nation) => (
                <div key={nation.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">{nation.name}</h4>
                        {leaderboardVisibility[nation.id] && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                            Public
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Population: {nation.assessmentData.population.toLocaleString()}</p>
                        <p>Location: {nation.assessmentData.location}</p>
                        <p>Political: {nation.assessmentData.politicalStructure}</p>
                        <p>Social: {Array.isArray(nation.assessmentData.socialOrganization) 
                          ? nation.assessmentData.socialOrganization.join(', ') 
                          : nation.assessmentData.socialOrganization}</p>
                        <div className="flex items-center space-x-1 mt-2">
                          <Calendar className="h-4 w-4" />
                          <span>Created: {new Date(nation.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {user && (
                        <button
                          onClick={() => handleTogglePublicVisibility(nation)}
                          disabled={loadingVisibility === nation.id}
                          className={`p-2 rounded-lg transition-colors ${
                            leaderboardVisibility[nation.id]
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={leaderboardVisibility[nation.id] ? 'Remove from Public Leaderboard' : 'Add to Public Leaderboard'}
                        >
                          {loadingVisibility === nation.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          ) : (
                            <Users className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleShare(nation)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Share Nation"
                      >
                        {copiedNationId === nation.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Share2 className="h-4 w-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => onLoad(nation)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Analysis"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => onEdit(nation)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Nation"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(nation.id, nation.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Nation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Usage Information */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-gray-600 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-1">Nation Management</p>
                  <ul className="space-y-1">
                    <li>• <strong>Public:</strong> Add nations to leaderboards for community comparison</li>
                    <li>• <strong>Share:</strong> Generate links to share nations with others</li>
                    <li>• <strong>Edit:</strong> Modify nation parameters and regenerate analysis</li>
                    <li>• <strong>Compare:</strong> Use Nation vs Nation to analyze multiple nations side-by-side</li>
                  </ul>
                  {!isPremium && (
                    <p className="mt-2 text-yellow-700">
                      <strong>Free users:</strong> Limited to {maxNations} saved nations. 
                      <span className="text-blue-600 cursor-pointer hover:underline"> Upgrade to Premium</span> for up to 30 nations.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Copy Success Notification */}
      {copiedNationId && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
          <Check className="h-4 w-4" />
          <span>Share link copied to clipboard!</span>
        </div>
      )}
    </>
  );
}