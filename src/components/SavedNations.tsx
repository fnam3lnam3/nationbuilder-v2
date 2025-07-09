import React from 'react';
import { Globe, Calendar, Trash2, Edit, Eye, Share2, Copy, Check, Trophy, Trophy as TrophyOff, Users, Swords } from 'lucide-react';
import { SavedNation } from '../types';
import { useState } from 'react';
import { toggleLeaderboardVisibility, checkLeaderboardVisibility } from '../utils/leaderboard';
import NationVsNation from './NationVsNation';

interface SavedNationsProps {
  nations: SavedNation[];
  onLoad: (nation: SavedNation) => void;
  onDelete: (nationId: string) => void;
  onEdit: (nation: SavedNation) => void;
}

export default function SavedNations({ nations, onLoad, onDelete, onEdit }: SavedNationsProps) {
  const [copiedNationId, setCopiedNationId] = useState<string | null>(null);
  const [leaderboardVisibility, setLeaderboardVisibility] = useState<Record<string, boolean>>({});
  const [loadingVisibility, setLoadingVisibility] = useState<string | null>(null);
  const [showNationVsNation, setShowNationVsNation] = useState(false);

  // Load leaderboard visibility status for all nations
  React.useEffect(() => {
    const loadVisibilityStatus = async () => {
      const visibilityMap: Record<string, boolean> = {};
      for (const nation of nations) {
        const isVisible = await checkLeaderboardVisibility(nation.id);
        visibilityMap[nation.id] = isVisible;
      }
      setLeaderboardVisibility(visibilityMap);
    };

    if (nations.length > 0) {
      loadVisibilityStatus();
    }
  }, [nations]);

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
        <p className="text-gray-600">Create your first nation to get started!</p>
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

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Saved Nations ({nations.length}/5)</h3>
        <div className="grid gap-4">
          {nations.map((nation) => (
            <div key={nation.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">{nation.name}</h4>
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
      </div>
        </>
      )}
      {copiedNationId && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
          <Check className="h-4 w-4" />
          <span>Share link copied to clipboard!</span>
        </div>
      )}
    </>
  );
}