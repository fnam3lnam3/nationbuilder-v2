import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Zap, X, Eye, LogIn } from 'lucide-react';
import { getExpandedLeaderboardEntries, LeaderboardEntry } from '../utils/leaderboard';

interface ExpandedLeaderboardProps {
  onClose: () => void;
  onViewNation: (nationId: string) => void;
  user: any;
  onLogin: () => void;
  subscription: any;
}

export default function ExpandedLeaderboard({ 
  onClose, 
  onViewNation, 
  user, 
  onLogin,
  subscription 
}: ExpandedLeaderboardProps) {
  const [leaderboards, setLeaderboards] = useState<{
    utopian: LeaderboardEntry[];
    dystopian: LeaderboardEntry[];
    martian: LeaderboardEntry[];
  }>({
    utopian: [],
    dystopian: [],
    martian: []
  });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'utopian' | 'dystopian' | 'martian'>('utopian');

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const loadLeaderboards = async () => {
    try {
      const data = await getExpandedLeaderboardEntries();
      setLeaderboards(data);
    } catch (error) {
      console.error('Failed to load expanded leaderboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewNation = (nationId: string) => {
    if (!user) {
      onLogin();
      return;
    }
    onViewNation(nationId);
  };

  const isPremiumUser = subscription?.subscription_status === 'active';

  const LeaderboardTable = ({ 
    entries, 
    title, 
    icon: Icon, 
    color 
  }: { 
    entries: LeaderboardEntry[]; 
    title: string; 
    icon: any; 
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className={`${color} px-6 py-4 rounded-t-lg`}>
        <div className="flex items-center space-x-3">
          <Icon className="h-6 w-6 text-white" />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="w-8 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No nations in this category yet.</p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <div 
                key={entry.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                onClick={() => handleViewNation(entry.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 font-medium w-6 text-right">#{index + 1}</span>
                    {index < 3 && (
                      <div className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        'bg-orange-600'
                      }`}></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{entry.name}</div>
                    <div className="text-sm text-gray-500">by {entry.username}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Pop: {entry.assessmentData.population.toLocaleString()} • 
                      {entry.assessmentData.politicalStructure}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900">{entry.score}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                  <Eye className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Trophy className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Full Nation Leaderboards</h2>
            {isPremiumUser && (
              <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                Premium
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'utopian', label: 'Utopian Leaders', icon: Crown, color: 'text-green-600' },
              { id: 'dystopian', label: 'Dystopian Powers', icon: Zap, color: 'text-red-600' },
              { id: 'martian', label: 'Mars Pioneers', icon: Trophy, color: 'text-orange-600' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className={`h-4 w-4 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Leaderboard Content */}
          {activeTab === 'utopian' && (
            <LeaderboardTable
              entries={leaderboards.utopian}
              title="Top 30 Utopian Nations"
              icon={Crown}
              color="bg-green-600"
            />
          )}
          
          {activeTab === 'dystopian' && (
            <LeaderboardTable
              entries={leaderboards.dystopian}
              title="Top 30 Dystopian Nations"
              icon={Zap}
              color="bg-red-600"
            />
          )}
          
          {activeTab === 'martian' && (
            <LeaderboardTable
              entries={leaderboards.martian}
              title="Top 30 Mars Pioneer Nations"
              icon={Trophy}
              color="bg-orange-600"
            />
          )}

          {!user && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <LogIn className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-800 font-medium mb-2">Login Required</p>
              <p className="text-blue-600 text-sm mb-3">
                Sign in to view individual nation details and create your own nations.
              </p>
              <button
                onClick={onLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}