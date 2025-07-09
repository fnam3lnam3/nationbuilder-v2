import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Zap, Eye, LogIn } from 'lucide-react';
import { getLeaderboardEntries, LeaderboardEntry } from '../utils/leaderboard';

interface LeaderboardSectionProps {
  onViewNation: (nationId: string) => void;
  user: any;
  onLogin: () => void;
}

export default function LeaderboardSection({ onViewNation, user, onLogin }: LeaderboardSectionProps) {
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

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const loadLeaderboards = async () => {
    try {
      const data = await getLeaderboardEntries();
      setLeaderboards(data);
    } catch (error) {
      console.error('Failed to load leaderboards:', error);
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

  const LeaderboardCard = ({ 
    title, 
    entries, 
    icon: Icon, 
    color, 
    bgColor 
  }: { 
    title: string; 
    entries: LeaderboardEntry[]; 
    icon: any; 
    color: string;
    bgColor: string;
  }) => (
    <div className={`${bgColor} rounded-xl p-6 border border-white/20`}>
      <div className="flex items-center space-x-3 mb-4">
        <Icon className={`h-6 w-6 ${color}`} />
        <h4 className="text-lg font-semibold text-white">{title}</h4>
      </div>
      
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/20 rounded-lg p-3 animate-pulse">
              <div className="h-4 bg-white/30 rounded mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <p className="text-white/70 text-sm">No nations yet. Be the first!</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <div 
              key={entry.id}
              className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors cursor-pointer group"
              onClick={() => handleViewNation(entry.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-white/60 text-sm font-medium">#{index + 1}</span>
                  <div className="flex flex-col">
                    <span className="text-white font-medium text-sm truncate max-w-[120px]">
                      {entry.name}
                    </span>
                    <span className="text-white/50 text-xs">
                      by {entry.username}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white/80 text-sm font-bold">
                    {entry.score}
                  </span>
                  <Eye className="h-3 w-3 text-white/60 group-hover:text-white/80 transition-colors" />
                </div>
              </div>
              <div className="text-white/50 text-xs mt-1">
                Pop: {entry.assessmentData.population.toLocaleString()} • 
                {entry.assessmentData.politicalStructure}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* View Full Leaderboard Button */}
      <div className="mt-4 pt-3 border-t border-white/20">
        <button
          onClick={() => {
            if (!user) {
              onLogin();
              return;
            }
            // This will be handled by parent component
            window.dispatchEvent(new CustomEvent('showExpandedLeaderboard'));
          }}
          className="w-full flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg text-sm transition-colors"
        >
          <span>View Full Leaderboard (Top 30)</span>
        </button>
      </div>
      
      {!user && entries.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/20">
          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <LogIn className="h-3 w-3" />
            <span>Login to View Nations</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <section className="px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-white text-center mb-8">
          Top Rated Nations by Category
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <LeaderboardCard
            title="Utopian Leaders"
            entries={leaderboards.utopian}
            icon={Crown}
            color="text-yellow-400"
            bgColor="bg-green-600/20 backdrop-blur-sm"
          />
          
          <LeaderboardCard
            title="Dystopian Powers"
            entries={leaderboards.dystopian}
            icon={Zap}
            color="text-red-400"
            bgColor="bg-red-600/20 backdrop-blur-sm"
          />
          
          <LeaderboardCard
            title="Mars Pioneers"
            entries={leaderboards.martian}
            icon={Trophy}
            color="text-orange-400"
            bgColor="bg-orange-600/20 backdrop-blur-sm"
          />
        </div>
      </div>
    </section>
  );
}