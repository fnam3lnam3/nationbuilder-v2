import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User, SavedNation, AssessmentData, ResultsData } from './types';
import { useSavedNations } from './hooks/useSavedNations';
import { useSessionManager } from './hooks/useSessionManager';
import { analytics } from './utils/analytics';
import { parseSharedNationFromUrl } from './utils/shareUtils';

// Component imports
import LandingPage from './components/LandingPage';
import AssessmentForm from './components/AssessmentForm';
import ResultsDashboard from './components/ResultsDashboard';
import UserProfile from './components/UserProfile';
import AuthForm from './components/AuthForm';
import SaveNationDialog from './components/SaveNationDialog';
import SubscriptionPlans from './components/SubscriptionPlans';
import LeaderboardSection from './components/LeaderboardSection';
import ExpandedLeaderboard from './components/ExpandedLeaderboard';
import DatabaseTest from './components/DatabaseTest';
import ServerStorageTest from './components/ServerStorageTest';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type AppView = 
  | 'landing' 
  | 'assessment' 
  | 'results' 
  | 'profile' 
  | 'leaderboard'
  | 'privacy'
  | 'terms';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [customPolicies, setCustomPolicies] = useState<any>({});
  const [editingNation, setEditingNation] = useState<SavedNation | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false);
  const [showExpandedLeaderboard, setShowExpandedLeaderboard] = useState(false);
  const [showDatabaseTest, setShowDatabaseTest] = useState(false);
  const [showServerTest, setShowServerTest] = useState(false);
  const [loading, setLoading] = useState(true);

  const savedNationsManager = useSavedNations(user, subscription);
  const sessionManager = useSessionManager();

  // Initialize app and check for shared nations
  useEffect(() => {
    initializeApp();
    checkForSharedNation();
    
    // Listen for expanded leaderboard events
    const handleShowExpandedLeaderboard = () => {
      setShowExpandedLeaderboard(true);
    };
    
    window.addEventListener('showExpandedLeaderboard', handleShowExpandedLeaderboard);
    
    return () => {
      window.removeEventListener('showExpandedLeaderboard', handleShowExpandedLeaderboard);
    };
  }, []);

  // Monitor auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserData(session.user);
        analytics.logUserLogin(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        if (user) {
          analytics.logUserLogout(user.id);
        }
        setUser(null);
        setSubscription(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [user]);

  const initializeApp = async () => {
    try {
      analytics.startSession();
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserData(session.user);
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (authUser: any) => {
    try {
      // Create user object from auth data
      const userData: User = {
        id: authUser.id,
        username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'User',
        email: authUser.email || '',
        city: authUser.user_metadata?.city,
        country: authUser.user_metadata?.country,
        age: authUser.user_metadata?.age,
        createdAt: new Date(authUser.created_at)
      };

      setUser(userData);

      // Load subscription data
      const { data: subscriptionData } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      setSubscription(subscriptionData);

      // Check for pending nation save after subscription upgrade
      const pendingNationName = sessionStorage.getItem('pendingNationName');
      const pendingNationSave = sessionStorage.getItem('pendingNationSave');
      
      if (pendingNationName && pendingNationSave && assessmentData) {
        sessionStorage.removeItem('pendingNationName');
        sessionStorage.removeItem('pendingNationSave');
        setShowSaveDialog(true);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const checkForSharedNation = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('shared');
    
    if (sharedData) {
      try {
        const sharedNation = await parseSharedNationFromUrl(window.location.href);
        if (sharedNation) {
          setAssessmentData(sharedNation.assessmentData);
          setCustomPolicies(sharedNation.customPolicies || {});
          setEditingNation({
            id: 'shared-nation',
            name: sharedNation.name,
            assessmentData: sharedNation.assessmentData,
            customPolicies: sharedNation.customPolicies,
            createdAt: new Date(sharedNation.createdAt)
          });
          
          // Generate results for shared nation
          await handleAssessmentComplete(sharedNation.assessmentData, sharedNation.customPolicies);
          
          // Clear URL parameter
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (error) {
        console.error('Error loading shared nation:', error);
      }
    }
  };

  const handleAssessmentComplete = async (data: AssessmentData, policies: any = {}) => {
    setAssessmentData(data);
    setCustomPolicies(policies);
    
    // Generate mock results - in real app this would call an AI service
    const mockResults: ResultsData = {
      metrics: {
        resourceEfficiency: Math.min(90, (data.resources * 8) + (data.technologyLevel * 5) + (data.educationLevel * 3)),
        rightsProtection: Math.min(95, (data.educationLevel * 7) + (data.technologyLevel * 4) + (data.religiousDiversity * 3)),
        adaptability: Math.min(88, (data.technologyLevel * 8) + (data.educationLevel * 5) + (data.resources * 2)),
        socialCohesion: Math.min(92, (100 - data.religiousDiversity * 5) + (data.educationLevel * 4) + (data.languages <= 3 ? 20 : 0)),
        economicGrowth: Math.min(85, (data.resources * 6) + (data.technologyLevel * 7) + (data.educationLevel * 4)),
        sustainability: Math.min(90, (data.environmentalChallenges.length <= 2 ? 40 : 20) + (data.technologyLevel * 5) + (data.educationLevel * 3))
      },
      politicalAnalysis: {
        actualGovernanceType: data.politicalStructure,
        evolutionPrediction: "Stable democratic institutions with potential for increased citizen participation",
        failureCauses: ["Economic inequality", "Political polarization", "External threats"],
        growthPathways: ["Digital governance", "Participatory democracy", "Regional cooperation"],
        institutionalRecommendations: ["Independent judiciary", "Transparent elections", "Civil society engagement"]
      },
      economicAnalysis: {
        actualEconomicSystem: data.economicModel,
        systemEvolution: "Mixed economy trending toward sustainable development",
        failureRisks: ["Resource depletion", "Market volatility", "Technological disruption"],
        gdpGrowthPathways: ["Innovation investment", "Education expansion", "Infrastructure development"],
        stabilizationMeasures: ["Diversified economy", "Social safety nets", "Regulatory frameworks"]
      },
      recommendations: {
        governanceStructure: "Federal democratic republic with strong local autonomy",
        keyInstitutions: ["Constitutional court", "Electoral commission", "Anti-corruption agency"],
        economicFramework: "Social market economy with environmental regulations",
        socialPolicies: ["Universal healthcare", "Education investment", "Social mobility programs"]
      },
      comparisons: {
        historicalSimilar: ["Modern Germany", "Canada", "New Zealand"],
        strengthsWeaknesses: {
          strengths: ["High education levels", "Technological advancement", "Democratic institutions"],
          weaknesses: ["Resource constraints", "Environmental challenges", "Social inequality"]
        }
      },
      constitution: {
        preamble: "We, the people of this nation, in order to form a more perfect union, establish justice, ensure domestic tranquility, provide for the common defense, promote the general welfare, and secure the blessings of liberty to ourselves and our posterity, do ordain and establish this Constitution.",
        articles: [
          {
            title: "Article I: Fundamental Rights",
            content: "All citizens shall enjoy fundamental rights including freedom of speech, religion, assembly, and the press. These rights are inalienable and shall not be infringed upon by any government action."
          },
          {
            title: "Article II: Government Structure",
            content: "The government shall be organized into three branches: legislative, executive, and judicial. Each branch shall have distinct powers and responsibilities, with appropriate checks and balances."
          },
          {
            title: "Article III: Citizenship and Representation",
            content: "All persons born or naturalized within the nation's territory shall be citizens. Representation in government shall be based on population and shall be reapportioned regularly."
          }
        ],
        adoptionMechanism: "This constitution shall be adopted by a two-thirds majority vote in a national referendum.",
        amendmentProcess: "Amendments may be proposed by a two-thirds majority of the legislature or by petition of 10% of registered voters, and must be ratified by a majority vote in a national referendum.",
        lawmakingProcess: "Laws shall be proposed in the legislature, debated publicly, and passed by majority vote. The executive may sign or veto legislation, subject to legislative override.",
        signatureBlock: [
          "Adopted by the Constitutional Convention",
          "Ratified by the People",
          `Date: ${new Date().toLocaleDateString()}`
        ]
      }
    };

    setResultsData(mockResults);
    setCurrentView('results');
    
    analytics.logNationCreated(user?.id, data);
  };

  const handleSaveNation = async (name: string) => {
    if (!assessmentData) return;

    try {
      if (editingNation && editingNation.id !== 'shared-nation') {
        // Update existing nation
        await savedNationsManager.updateNation(editingNation.id, name, assessmentData, customPolicies);
        setEditingNation(null);
      } else {
        // Save new nation
        await savedNationsManager.saveNation(name, assessmentData, customPolicies);
      }
      
      setShowSaveDialog(false);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to save nation');
    }
  };

  const handleLoadNation = (nation: SavedNation) => {
    setAssessmentData(nation.assessmentData);
    setCustomPolicies(nation.customPolicies || {});
    setEditingNation(nation);
    handleAssessmentComplete(nation.assessmentData, nation.customPolicies);
  };

  const handleEditNation = (nation: SavedNation) => {
    setAssessmentData(nation.assessmentData);
    setCustomPolicies(nation.customPolicies || {});
    setEditingNation(nation);
    setCurrentView('assessment');
  };

  const handleDeleteNation = async (nationId: string) => {
    try {
      await savedNationsManager.deleteNation(nationId);
      analytics.logNationDeleted(user?.id, nationId);
    } catch (error) {
      console.error('Error deleting nation:', error);
      alert('Failed to delete nation. Please try again.');
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuthForm(false);
    analytics.logUserLogin(userData.id);
  };

  const handleLogout = async () => {
    if (user) {
      analytics.logUserLogout(user.id);
    }
    analytics.endSession(user?.id);
    await supabase.auth.signOut();
    setCurrentView('landing');
  };

  const handleViewNation = async (nationId: string) => {
    // This would load a specific nation by ID for viewing
    console.log('View nation:', nationId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Nationbuilder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      {currentView === 'landing' && (
        <div>
          <LandingPage 
            onGetStarted={() => setCurrentView('assessment')}
            onLogin={() => setShowAuthForm(true)}
          />
          <LeaderboardSection 
            onViewNation={handleViewNation}
            user={user}
            onLogin={() => setShowAuthForm(true)}
          />
        </div>
      )}

      {currentView === 'assessment' && (
        <AssessmentForm 
          onComplete={handleAssessmentComplete}
          onBack={() => setCurrentView('landing')}
          initialData={assessmentData}
          initialPolicies={customPolicies}
          editingNation={editingNation}
        />
      )}

      {currentView === 'results' && resultsData && (
        <ResultsDashboard 
          data={resultsData}
          assessmentData={assessmentData!}
          customPolicies={customPolicies}
          onSave={() => setShowSaveDialog(true)}
          onNewAssessment={() => {
            setAssessmentData(null);
            setResultsData(null);
            setEditingNation(null);
            setCurrentView('assessment');
          }}
          onShowProfile={() => setCurrentView('profile')}
          user={user}
          onLogin={() => setShowAuthForm(true)}
        />
      )}

      {currentView === 'profile' && user && (
        <UserProfile 
          user={user}
          subscription={subscription}
          savedNations={savedNationsManager.savedNations}
          onLoad={handleLoadNation}
          onDelete={handleDeleteNation}
          onEdit={handleEditNation}
          onLogout={handleLogout}
          onShowSubscriptionPlans={() => setShowSubscriptionPlans(true)}
          onBack={() => setCurrentView('landing')}
        />
      )}

      {currentView === 'privacy' && (
        <PrivacyPolicy onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'terms' && (
        <TermsOfService onBack={() => setCurrentView('landing')} />
      )}

      {/* Modals and Overlays */}
      {showAuthForm && (
        <AuthForm 
          mode={authMode}
          onLogin={handleLogin}
          onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
          onClose={() => setShowAuthForm(false)}
        />
      )}

      {showSaveDialog && assessmentData && (
        <SaveNationDialog 
          user={user}
          onSave={handleSaveNation}
          onLogin={() => {
            setShowSaveDialog(false);
            setShowAuthForm(true);
          }}
          onClose={() => setShowSaveDialog(false)}
          isExistingNation={editingNation !== null && editingNation.id !== 'shared-nation'}
          defaultName={editingNation?.name || ''}
          savedNations={savedNationsManager.savedNations}
          maxNations={savedNationsManager.getMaxNations()}
          onDeleteNation={handleDeleteNation}
          onUpgrade={() => {
            setShowSaveDialog(false);
            setShowSubscriptionPlans(true);
          }}
          subscription={subscription}
        />
      )}

      {showSubscriptionPlans && user && (
        <SubscriptionPlans 
          user={user}
          onClose={() => setShowSubscriptionPlans(false)}
        />
      )}

      {showExpandedLeaderboard && (
        <ExpandedLeaderboard 
          onClose={() => setShowExpandedLeaderboard(false)}
          onViewNation={handleViewNation}
          user={user}
          onLogin={() => setShowAuthForm(true)}
          subscription={subscription}
        />
      )}

      {showDatabaseTest && (
        <DatabaseTest onClose={() => setShowDatabaseTest(false)} />
      )}

      {showServerTest && (
        <ServerStorageTest onClose={() => setShowServerTest(false)} />
      )}

      {/* Development Tools */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 space-y-2">
          <button
            onClick={() => setShowDatabaseTest(true)}
            className="block bg-gray-800 text-white px-3 py-1 rounded text-xs hover:bg-gray-700"
          >
            DB Test
          </button>
          <button
            onClick={() => setShowServerTest(true)}
            className="block bg-gray-800 text-white px-3 py-1 rounded text-xs hover:bg-gray-700"
          >
            Server Test
          </button>
        </div>
      )}
    </div>
  );
}