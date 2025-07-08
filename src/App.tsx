import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AssessmentForm from './components/AssessmentForm';
import ResultsDashboard from './components/ResultsDashboard';
import UserAuth from './components/UserAuth';
import SavedNations from './components/SavedNations';
import { AssessmentData, User, SavedNation } from './types';

type AppState = 'landing' | 'assessment' | 'results' | 'saved-nations';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [customPolicies, setCustomPolicies] = useState<Record<string, string>>({});
  const [user, setUser] = useState<User | null>(null);
  const [savedNations, setSavedNations] = useState<SavedNation[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [currentNationId, setCurrentNationId] = useState<string | null>(null);

  // Load saved data from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('nationbuilder_user');
    const savedNationsData = localStorage.getItem('nationbuilder_nations');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedNationsData) {
      setSavedNations(JSON.parse(savedNationsData));
    }
  }, []);

  // Save user and nations to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('nationbuilder_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('nationbuilder_nations', JSON.stringify(savedNations));
  }, [savedNations]);

  const handleStartAssessment = () => {
    setCurrentState('assessment');
  };

  const handleAssessmentComplete = (data: AssessmentData) => {
    console.log('Assessment completed with data:', data);
    setAssessmentData(data);
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
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    setSavedNations([]);
    localStorage.removeItem('nationbuilder_user');
    localStorage.removeItem('nationbuilder_nations');
  };

  const handleSaveNation = (name: string) => {
    if (!assessmentData || !user) return;

    if (savedNations.length >= 5) {
      alert('You can only save up to 5 nations per session. Please delete one to save a new nation.');
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
          />
          {showAuth && (
            <UserAuth
              onLogin={handleLogin}
              onClose={() => setShowAuth(false)}
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
    
    default:
      return <LandingPage onStartAssessment={handleStartAssessment} user={user} onLogin={() => setShowAuth(true)} onLogout={handleLogout} onViewSavedNations={handleViewSavedNations} />;
  }
}

export default App;