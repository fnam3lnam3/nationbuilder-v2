import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import LandingPage from './components/LandingPage';
import AssessmentForm from './components/AssessmentForm';
import ResultsDashboard from './components/ResultsDashboard';
import AuthForm from './components/AuthForm';
import SubscriptionPlans from './components/SubscriptionPlans';
import SuccessPage from './components/SuccessPage';
import SavedNations from './components/SavedNations';
import { AssessmentData, User, SavedNation } from './types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type AppState = 'landing' | 'assessment' | 'results' | 'saved-nations' | 'success';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [customPolicies, setCustomPolicies] = useState<Record<string, string>>({});
  const [user, setUser] = useState<User | null>(null);
  const [savedNations, setSavedNations] = useState<SavedNation[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [currentNationId, setCurrentNationId] = useState<string | null>(null);

  // Initialize auth state and load saved data
  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          city: '',
          country: '',
          age: 0,
          createdAt: new Date(session.user.created_at)
        });
        fetchSubscription();
      }
    });

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            city: '',
            country: '',
            age: 0,
            createdAt: new Date(session.user.created_at)
          });
          fetchSubscription();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSubscription(null);
          setSavedNations([]);
        }
      }
    );

    // Load saved nations from localStorage for backward compatibility
    const savedNationsData = localStorage.getItem('nationbuilder_nations');
    if (savedNationsData) {
      setSavedNations(JSON.parse(savedNationsData));
    }

    return () => authSubscription.unsubscribe();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  // Save nations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nationbuilder_nations', JSON.stringify(savedNations));
  }, [savedNations]);

  const handleStartAssessment = () => {
    setCurrentState('assessment');
  };

  const handleAssessmentComplete = (data: AssessmentData) => {
    console.log('Assessment completed with data:', data);
    
    // Validate that we have the required data
    if (!data || !data.location || !data.economicModel || !data.politicalStructure || !data.socialOrganization) {
      console.error('Invalid assessment data received:', data);
      alert('Assessment data is incomplete. Please try again.');
      return;
    }
    
    // Ensure all array fields are properly initialized
    const sanitizedData = {
      ...data,
      climate: data.climate || [],
      environmentalChallenges: data.environmentalChallenges || [],
      educationSystem: data.educationSystem || [],
      healthcare: data.healthcare || [],
      security: data.security || [],
      resourceManagement: data.resourceManagement || [],
      legalFramework: data.legalFramework || []
    };
    
    setAssessmentData(sanitizedData);
    setCurrentState('results');
  };

  const handleBackToLanding = () => {
    setCurrentState('landing');
    setAssessmentData(null);
    setCustomPolicies({});
    setCurrentNationId(null);
  };

  const handleBackToAssessment = () => {
    setCurrentState('assessment');
  };

  const handleStartNewAssessment = () => {
    setAssessmentData(null);
    setCustomPolicies({});
    setCurrentNationId(null);
    setCurrentState('assessment');
  };

  const handleLogin = (userData: User) => {
    setShowAuth(false);
    // User state is handled by auth state change listener
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  const handleSaveNation = (name: string) => {
    if (!assessmentData || !user) return;

    const maxNations = subscription?.subscription_status === 'active' ? 30 : 5;
    
    if (savedNations.length >= maxNations) {
      alert(`You can only save up to ${maxNations} nations${subscription?.subscription_status === 'active' ? ' with your premium subscription' : ' in the free tier'}. Please delete one to save a new nation.`);
      return;
    }

    const newNation: SavedNation = {
      id: currentNationId || Math.random().toString(36).substr(2, 9),
      name,
      assessmentData,
      customPolicies: Object.keys(customPolicies).length > 0 ? customPolicies : undefined,
      createdAt: currentNationId ? savedNations.find(n => n.id === currentNationId)?.createdAt || new Date() : new Date(),
      lastModified: new Date()
    };

    if (currentNationId) {
      // Update existing nation
      setSavedNations(prev => prev.map(nation => 
        nation.id === currentNationId ? newNation : nation
      ));
    } else {
      // Save new nation
      setSavedNations(prev => [...prev, newNation]);
      setCurrentNationId(newNation.id);
    }
  };

  const handleLoadNation = (nation: SavedNation) => {
    setAssessmentData(nation.assessmentData);
    setCustomPolicies(nation.customPolicies || {});
    setCurrentNationId(nation.id);
    setCurrentState('results');
  };

  const handleEditNation = (nation: SavedNation) => {
    setAssessmentData(nation.assessmentData);
    setCustomPolicies(nation.customPolicies || {});
    setCurrentNationId(nation.id);
    setCurrentState('assessment');
  };

  const handleDeleteNation = (nationId: string) => {
    if (confirm('Are you sure you want to delete this nation?')) {
      setSavedNations(prev => prev.filter(nation => nation.id !== nationId));
      if (currentNationId === nationId) {
        setCurrentNationId(null);
      }
    }
  };

  const handleViewSavedNations = () => {
    setCurrentState('saved-nations');
  };

  const handlePolicyUpdate = (policies: Record<string, string>) => {
    setCustomPolicies(policies);
  };

  const handleShowSubscriptionPlans = () => {
    setShowSubscriptionPlans(true);
  };

  const handleSuccessContinue = () => {
    setCurrentState('landing');
  };

  // Check URL for success page
  useEffect(() => {
    if (window.location.pathname === '/success') {
      setCurrentState('success');
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }
  }, []);

  switch (currentState) {
    case 'landing':
      return (
        <>
          <LandingPage 
            onStartAssessment={handleStartAssessment}
            user={user}
            onLogin={() => setShowAuth(true)}
            onLogout={handleLogout}
            onViewSavedNations={handleViewSavedNations}
            onShowSubscriptionPlans={handleShowSubscriptionPlans}
            subscription={subscription}
          />
          {showAuth && (
            <AuthForm
              mode={authMode}
              onLogin={handleLogin}
              onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              onClose={() => setShowAuth(false)}
            />
          )}
          {showSubscriptionPlans && user && (
            <SubscriptionPlans
              user={user}
              onClose={() => setShowSubscriptionPlans(false)}
            />
          )}
        </>
      );
    
    case 'assessment':
      return (
        <AssessmentForm
          onComplete={handleAssessmentComplete}
          onBack={handleBackToLanding}
          initialData={assessmentData}
        />
      );
    
    case 'results':
      if (!assessmentData) {
        console.error('No assessment data available for results');
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">No Assessment Data</h2>
              <p className="text-gray-600 mb-4">Please complete an assessment first.</p>
              <button
                onClick={handleStartNewAssessment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Start New Assessment
              </button>
            </div>
          </div>
        );
      }
      
      return (
        <ResultsDashboard
          assessmentData={assessmentData}
          customPolicies={customPolicies}
          onBack={handleBackToAssessment}
          onStartNew={handleStartNewAssessment}
          onPolicyUpdate={handlePolicyUpdate}
          user={user}
          onLogin={() => setShowAuth(true)}
          onSaveNation={handleSaveNation}
          isExistingNation={!!currentNationId}
        />
      );
    
    case 'saved-nations':
      return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Your Saved Nations</h1>
                <button
                  onClick={handleBackToLanding}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Home
                </button>
              </div>
              <SavedNations
                nations={savedNations}
                onLoad={handleLoadNation}
                onDelete={handleDeleteNation}
                onEdit={handleEditNation}
              />
            </div>
          </div>
        </div>
      );
    
    case 'success':
      return <SuccessPage onContinue={handleSuccessContinue} />;
    
    default:
      return (
        <LandingPage 
          onStartAssessment={handleStartAssessment} 
          user={user} 
          onLogin={() => setShowAuth(true)} 
          onLogout={handleLogout} 
          onViewSavedNations={handleViewSavedNations}
          onShowSubscriptionPlans={handleShowSubscriptionPlans}
          subscription={subscription}
        />
      );
  }
}

export default App;