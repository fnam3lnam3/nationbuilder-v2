import { createClient } from '@supabase/supabase-js';
import { SavedNation, AssessmentData } from '../types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface LeaderboardEntry {
  id: string;
  name: string;
  username: string;
  score: number;
  assessmentData: AssessmentData;
  customPolicies?: any;
  createdAt: Date;
  category: 'utopian' | 'dystopian' | 'martian';
}

// Scoring algorithms for different categories
export const calculateUtopianScore = (data: AssessmentData): number => {
  let score = 0;
  
  // High education and technology levels
  score += data.educationLevel * 10;
  score += data.technologyLevel * 10;
  
  // Abundant resources
  score += data.resources * 8;
  
  // Democratic governance
  if (data.politicalStructure === 'Direct democracy' || data.politicalStructure === 'Representative democracy') {
    score += 50;
  }
  
  // Universal systems
  if (data.educationSystem.includes('Universal public')) score += 30;
  if (data.healthcare.includes('Universal access')) score += 30;
  
  // Environmental sustainability
  if (data.environmentalChallenges.length <= 2) score += 40;
  
  // Social harmony indicators
  if (data.languages <= 3) score += 20;
  if (data.religiousDiversity <= 5) score += 20;
  
  // Legal framework
  if (data.legalFramework.includes('Habeas corpus')) score += 15;
  if (data.legalFramework.includes('Trial by peers')) score += 15;
  
  return Math.min(1000, score); // Cap at 1000
};

export const calculateDystopianScore = (data: AssessmentData): number => {
  let score = 0;
  
  // Authoritarian governance
  if (data.politicalStructure === 'Fascism' || data.politicalStructure === 'Martial law/Anarchic') {
    score += 100;
  }
  
  // Resource scarcity
  score += (10 - data.resources) * 15;
  
  // Environmental challenges
  score += data.environmentalChallenges.length * 20;
  
  // Low education/technology (creates dependency)
  if (data.educationLevel <= 4) score += 50;
  if (data.technologyLevel >= 8) score += 30; // High tech can enable surveillance
  
  // Social control indicators
  if (data.legalFramework.includes('Executive power as final authority')) score += 40;
  if (data.legalFramework.includes('Incarceration without being read your rights or told your charge')) score += 60;
  if (data.legalFramework.includes('Capital punishment is available')) score += 20;
  
  // Lack of rights
  if (!data.legalFramework.includes('Habeas corpus')) score += 30;
  if (!data.legalFramework.includes('Ability to appeal judicial judgments')) score += 25;
  
  // Economic control
  if (data.economicModel === 'Communistic' || data.economicModel === 'AI-managed') score += 40;
  
  return Math.min(1000, score);
};

export const calculateMartianScore = (data: AssessmentData): number => {
  let score = 0;
  
  // Space-based location
  if (data.location === 'Space station or space-traveling coommunity') {
    score += 200;
  } else if (data.location === 'Planetary colony') {
    score += 150;
  }
  
  // High technology requirement
  score += data.technologyLevel * 15;
  
  // Resource management critical
  if (data.resourceManagement.includes('Water management')) score += 30;
  if (data.resourceManagement.includes('Energy distribution')) score += 30;
  if (data.resourceManagement.includes('Food security')) score += 30;
  
  // Environmental challenges typical of Mars
  if (data.environmentalChallenges.includes('harsh climate')) score += 40;
  if (data.environmentalChallenges.includes('Limited space')) score += 30;
  if (data.environmentalChallenges.includes('High radiation')) score += 50;
  
  // Small population (typical of colonies)
  if (data.population <= 1000000) score += 50;
  
  // Advanced healthcare needed
  if (data.healthcare.includes('Research-based medicine')) score += 25;
  if (data.healthcare.includes('Emergency response')) score += 25;
  
  // Education for survival
  if (data.educationLevel >= 7) score += 40;
  
  // Cooperative social organization
  if (Array.isArray(data.socialOrganization) && data.socialOrganization.includes('Communalism')) {
    score += 30;
  }
  
  return Math.min(1000, score);
};

export const getLeaderboardEntries = async (): Promise<{
  utopian: LeaderboardEntry[];
  dystopian: LeaderboardEntry[];
  martian: LeaderboardEntry[];
}> => {
  try {
    // Fetch all saved nations with public profile information
    const { data: nations, error } = await supabase
      .from('saved_nations')
      .select(`
        *,
        public_profiles!inner(username, display_name, is_leaderboard_visible)
      `)
      .eq('is_temporary', false)
      .is('deleted_at', null)
      .eq('public_profiles.is_leaderboard_visible', true)
      .limit(100); // Limit for performance

    if (error) {
      console.error('Error fetching nations for leaderboard:', error);
      return { utopian: [], dystopian: [], martian: [] };
    }

    // Process nations with actual usernames
    const allEntries: LeaderboardEntry[] = (nations || [])
      .map(nation => {
      const assessmentData = nation.assessment_data;
      const profile = nation.public_profiles;
      const username = profile?.display_name || profile?.username || 'Anonymous';
      const utopianScore = calculateUtopianScore(assessmentData);
      const dystopianScore = calculateDystopianScore(assessmentData);
      const martianScore = calculateMartianScore(assessmentData);
      
      // Determine primary category based on highest score
      let category: 'utopian' | 'dystopian' | 'martian' = 'utopian';
      let score = utopianScore;
      
      if (dystopianScore > score) {
        category = 'dystopian';
        score = dystopianScore;
      }
      
      if (martianScore > score) {
        category = 'martian';
        score = martianScore;
      }

      return {
        id: nation.id,
        name: nation.name,
        username,
        score,
        assessmentData,
        customPolicies: nation.custom_policies,
        createdAt: new Date(nation.created_at),
        category
      };
    });

    // Filter nations for Mars Pioneers: include any non-Earth location with visible profiles
    const marsEligibleNations = (nations || []).filter(nation => {
      const location = nation.assessment_data.location;
      return location && location !== 'Earth-based' && nation.public_profiles?.is_leaderboard_visible;
    });

    // Sort and get top entries for each category
    const utopian = allEntries
      .map(entry => ({ ...entry, score: calculateUtopianScore(entry.assessmentData) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const dystopian = allEntries
      .map(entry => ({ ...entry, score: calculateDystopianScore(entry.assessmentData) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Mars Pioneers: Include ALL non-Earth nations, sorted by Mars score
    const martian = marsEligibleNations
      .map(nation => {
        const profile = nation.public_profiles;
        const username = profile?.display_name || profile?.username || 'Anonymous';
        return {
          id: nation.id,
          name: nation.name,
          username,
          score: calculateMartianScore(nation.assessment_data),
          assessmentData: nation.assessment_data,
          customPolicies: nation.custom_policies,
          createdAt: new Date(nation.created_at),
          category: 'martian' as const
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return { utopian, dystopian, martian };
  } catch (error) {
    console.error('Error generating leaderboard:', error);
    return { utopian: [], dystopian: [], martian: [] };
  }
};

export const getExpandedLeaderboardEntries = async (): Promise<{
  utopian: LeaderboardEntry[];
  dystopian: LeaderboardEntry[];
  martian: LeaderboardEntry[];
}> => {
  try {
    // Fetch all saved nations with public profile information for expanded leaderboard
    const { data: nations, error } = await supabase
      .from('saved_nations')
      .select(`
        *,
        public_profiles!inner(username, display_name, is_leaderboard_visible)
      `)
      .eq('is_temporary', false)
      .is('deleted_at', null)
      .eq('public_profiles.is_leaderboard_visible', true)
      .limit(200); // Higher limit for expanded view

    if (error) {
      console.error('Error fetching nations for expanded leaderboard:', error);
      return { utopian: [], dystopian: [], martian: [] };
    }

    // Process nations with actual usernames
    const allEntries: LeaderboardEntry[] = (nations || [])
      .map(nation => {
      const assessmentData = nation.assessment_data;
      const profile = nation.public_profiles;
      const username = profile?.display_name || profile?.username || 'Anonymous';
      const utopianScore = calculateUtopianScore(assessmentData);
      const dystopianScore = calculateDystopianScore(assessmentData);
      const martianScore = calculateMartianScore(assessmentData);
      
      // Determine primary category based on highest score
      let category: 'utopian' | 'dystopian' | 'martian' = 'utopian';
      let score = utopianScore;
      
      if (dystopianScore > score) {
        category = 'dystopian';
        score = dystopianScore;
      }
      
      if (martianScore > score) {
        category = 'martian';
        score = martianScore;
      }

      return {
        id: nation.id,
        name: nation.name,
        username,
        score,
        assessmentData,
        customPolicies: nation.custom_policies,
        createdAt: new Date(nation.created_at),
        category
      };
    });

    // Filter nations for Mars Pioneers: include any non-Earth location with visible profiles
    const marsEligibleNations = (nations || []).filter(nation => {
      const location = nation.assessment_data.location;
      return location && location !== 'Earth-based' && nation.public_profiles?.is_leaderboard_visible;
    });

    // Sort and get top 30 entries for each category
    const utopian = allEntries
      .map(entry => ({ ...entry, score: calculateUtopianScore(entry.assessmentData) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);

    const dystopian = allEntries
      .map(entry => ({ ...entry, score: calculateDystopianScore(entry.assessmentData) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);

    // Mars Pioneers: Include ALL non-Earth nations, sorted by Mars score, up to 30
    const martian = marsEligibleNations
      .map(nation => {
        const profile = nation.public_profiles;
        const username = profile?.display_name || profile?.username || 'Anonymous';
        return {
          id: nation.id,
          name: nation.name,
          username,
          score: calculateMartianScore(nation.assessment_data),
          assessmentData: nation.assessment_data,
          customPolicies: nation.custom_policies,
          createdAt: new Date(nation.created_at),
          category: 'martian' as const
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);

    return { utopian, dystopian, martian };
  } catch (error) {
    console.error('Error generating expanded leaderboard:', error);
    return { utopian: [], dystopian: [], martian: [] };
  }
};

// Function to toggle leaderboard visibility for a nation
export const toggleLeaderboardVisibility = async (nationId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('toggle_leaderboard_visibility', {
      p_nation_id: nationId
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error toggling leaderboard visibility:', error);
    return false;
  }
};

// Function to check if a nation is visible on leaderboard
export const checkLeaderboardVisibility = async (nationId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('saved_nations')
      .select(`
        public_profiles!inner(is_leaderboard_visible)
      `)
      .eq('id', nationId)
      .single();

    if (error) return false;
    return data?.public_profiles?.is_leaderboard_visible || false;
  } catch (error) {
    console.error('Error checking leaderboard visibility:', error);
    return false;
  }
};

export const getNationById = async (nationId: string): Promise<SavedNation | null> => {
  try {
    const { data, error } = await supabase
      .from('saved_nations')
      .select('*')
      .eq('id', nationId)
      .eq('is_temporary', false)
      .is('deleted_at', null)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      userId: data.user_id,
      sessionId: data.session_id,
      assessmentData: data.assessment_data,
      customPolicies: data.custom_policies,
      isTemporary: data.is_temporary,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      expiresAt: data.expires_at ? new Date(data.expires_at) : null,
      deletedAt: data.deleted_at ? new Date(data.deleted_at) : null,
      isPublic: data.is_public,
      shareToken: data.share_token
    };
  } catch (error) {
    console.error('Error fetching nation by ID:', error);
    return null;
  }
};