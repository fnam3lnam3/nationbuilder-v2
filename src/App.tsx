import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useSessionManager } from './hooks/useSessionManager';
import { useSavedNations } from './hooks/useSavedNations';
import LandingPage from './components/LandingPage';
import AssessmentForm from './components/AssessmentForm';
import ResultsDashboard from './components/ResultsDashboard';
import AuthForm from './components/AuthForm';
import SubscriptionPlans from './components/SubscriptionPlans';
import SuccessPage from './components/SuccessPage';
import SavedNations from './components/SavedNations';
import SaveNationDialog from './components/SaveNationDialog';
import { AssessmentData, User, SavedNation } from './types';
import { analytics } from './utils/analytics';

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
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [currentNationId, setCurrentNationId] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [tempNationCreated, setTempNationCreated] = useState(false);

  // Use custom hooks for session and saved nations management
  const sessionManager = useSessionManager();
  const savedNationsManager = useSavedNations(user, subscription);

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
        analytics.logUserLogin(session.user.id);
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
          analytics.logUserLogin(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          if (user) {
            analytics.logUserLogout(user.id);
          }
          setUser(null);
          setSubscription(null);
          setSavedNations([]);
        }
      }
    );

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

  const handleStartAssessment = () => {
    setCurrentState('assessment');
  };

  const handleAssessmentComplete = (data: AssessmentData) => {
    console.log('App.tsx - Assessment completed with data:', data);
    console.log('App.tsx - Data validation check:', {
      hasLocation: !!data.location,
      hasEconomicModel: !!data.economicModel,
      hasPoliticalStructure: !!data.politicalStructure,
      hasSocialOrganization: !!data.socialOrganization
    });
    
    // Validate that we have the required data
    if (!data || !data.location || !data.economicModel || !data.politicalStructure || 
        !Array.isArray(data.socialOrganization) || data.socialOrganization.length === 0) {
      console.error('Invalid assessment data received:', data);
      alert('Assessment data is incomplete. Please complete all required fields and try again.');
      setCurrentState('assessment'); // Go back to assessment instead of staying on results
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
    console.log('App.tsx - Setting state to results with sanitized data:', sanitizedData);
    
    // Try to create temporary nation, but don't block results if it fails
    createTemporaryNation(sanitizedData).catch(error => {
      console.warn('Failed to create temporary nation, but continuing with results:', error);
    });
    
    setCurrentState('results');
  };

  const createTemporaryNation = async (data: AssessmentData) => {
    try {
      const tempName = `Nation Assessment ${new Date().toLocaleString()}`;
      await sessionManager.createTemporaryNation(tempName, data, customPolicies);
      setTempNationCreated(true);
    } catch (error) {
      console.error('Failed to create temporary nation:', error);
      // Continue anyway - user can still view results
    }
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
    setTempNationCreated(false);
    setCurrentState('assessment');
  };

  const handleLogin = (userData: User) => {
    setShowAuth(false);
    // User state is handled by auth state change listener
  };

  const handleLogout = () => {
    if (user) {
      analytics.logUserLogout(user.id);
    }
    supabase.auth.signOut();
  };

  const handleSaveNation = (name: string) => {
    setShowSaveDialog(true);
  };

  const handleSaveConfirm = async (name: string) => {
    if (!assessmentData) return;

    try {
      if (currentNationId) {
        // Update existing nation
        await savedNationsManager.updateNation(currentNationId, name, assessmentData, customPolicies);
      } else {
        // Save new nation
        const nationId = await savedNationsManager.saveNation(name, assessmentData, customPolicies);
        setCurrentNationId(nationId);
        
        // If user was logged in, link any temporary nation
        if (user && tempNationCreated) {
          await sessionManager.linkToUser(user.id);
          analytics.logNationCreated(user.id, { name, assessmentData });
        }
      }
      
      setTempNationCreated(false);
    } catch (error: any) {
      throw error; // Let SaveNationDialog handle the error display
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
    if (!window.confirm('Are you sure you want to delete this nation?')) return;
    
    if (user) {
      analytics.logNationDeleted(user.id, nationId);
    }
    
    savedNationsManager.deleteNation(nationId).then(success => {
      if (success && currentNationId === nationId) {
        setCurrentNationId(null);
      }
    });
  };

  const handleSaveDialogClose = () => {
    setShowSaveDialog(false);
    
    // If user chose not to save and there's a temporary nation, clean it up
    if (tempNationCreated && !currentNationId) {
      // The temporary nation will be automatically cleaned up by the database
      setTempNationCreated(false);
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
            savedNationsCount={savedNationsManager.savedNations.length}
            maxNations={savedNationsManager.getMaxNations()}
            savedNationsCount={savedNationsManager.savedNations.length}
            maxNations={savedNationsManager.getMaxNations()}
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
        <>
          <ResultsDashboard
            assessmentData={assessmentData}
            customPolicies={customPolicies}
            onBack={handleBackToAssessment}
            onStartNew={handleStartNewAssessment}
            onPolicyUpdate={handlePolicyUpdate}
            user={user}
            onLogin={() => setShowAuth(true)}
            onSaveNation={() => setShowSaveDialog(true)}
            isExistingNation={!!currentNationId}
          />
          {showSaveDialog && (
            <SaveNationDialog
              user={user}
              onSave={handleSaveConfirm}
              onLogin={() => {
                setShowSaveDialog(false);
                setShowAuth(true);
              }}
              onClose={handleSaveDialogClose}
              isExistingNation={!!currentNationId}
              defaultName={currentNationId ? savedNationsManager.savedNations.find(n => n.id === currentNationId)?.name || '' : ''}
            />
          )}
        </>
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
                nations={savedNationsManager.savedNations}
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