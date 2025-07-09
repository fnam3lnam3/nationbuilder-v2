import React from 'react';
import { useState, useEffect } from 'react';
import { ChevronRight, Globe, Scale, FileText, BarChart3, Users, Zap, LogIn, LogOut, BookOpen } from 'lucide-react';
import { User } from '../types';
import LeaderboardSection from './LeaderboardSection';
import { getNationById } from '../utils/leaderboard';
import { analytics } from '../utils/analytics';

interface LandingPageProps {
  onStartAssessment: () => void;
  user?: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onViewSavedNations: () => void;
  onShowSubscriptionPlans: () => void;
  subscription?: any;
  savedNationsCount?: number;
  maxNations?: number;
}

export default function LandingPage({ 
  onStartAssessment, 
  user, 
  onLogin, 
  onLogout, 
  onViewSavedNations, 
  onShowSubscriptionPlans,
  subscription,
  savedNationsCount = 0,
  maxNations = 5
}: LandingPageProps) {
  const [sharedNation, setSharedNation] = useState<any>(null);
  const [showSharedNation, setShowSharedNation] = useState(false);

  useEffect(() => {
    // Check for shared nation in URL
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('shared');
    
    if (sharedData) {
      try {
        const decodedData = JSON.parse(atob(sharedData));
        setSharedNation(decodedData);
        setShowSharedNation(true);
        
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      } catch (error) {
        console.error('Failed to decode shared nation data:', error);
      }
    }

    // Initialize analytics
    analytics.startSession(user?.id);

    return () => {
      analytics.endSession(user?.id);
    };
  }, [user]);

  const handleViewLeaderboardNation = async (nationId: string) => {
    try {
      const nation = await getNationById(nationId);
      if (nation) {
        setSharedNation(nation);
        setShowSharedNation(true);
      }
    } catch (error) {
      console.error('Failed to load nation:', error);
      alert('Failed to load nation. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      {/* Header */}
      <header className="px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Nationbuilder</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-100">Welcome, {user.username}</span>
                  {subscription?.subscription_status === 'active' && (
                    <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                      Premium
                    </span>
                  )}
                </div>
                {subscription?.subscription_status !== 'active' && (
                  <button
                    onClick={onShowSubscriptionPlans}
                    className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium transition-colors"
                  >
                    Upgrade
                  </button>
                )}
                <button
                  onClick={onViewSavedNations}
                  className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>My Nations ({savedNationsCount}/{maxNations})</span>
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center space-x-2 text-blue-100 hover:text-white transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Design the Future of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Human Governance
            </span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            AI-powered platform that analyzes governance systems, recommends economic frameworks, 
            and generates complete constitutional documents based on historical patterns and optimal outcomes.
          </p>
          <button
            onClick={onStartAssessment}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center space-x-2 mx-auto"
          >
            <span>Create Your Nation</span>
            <ChevronRight className="h-5 w-5" />
          </button>
          
          {user && (
            <p className="text-blue-200 mt-4 text-sm">
              You have {savedNationsCount}/{maxNations} saved nations. Customize policies after analysis.
              {subscription?.subscription_status !== 'active' && (
                <button
                  onClick={onShowSubscriptionPlans}
                  className="ml-2 text-yellow-300 hover:text-yellow-100 underline"
                >
                  Upgrade for more
                </button>
              )}
            </p>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Comprehensive Governance Analysis
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Scale className="h-8 w-8 text-blue-400 mb-4" />
              <h4 className="text-xl font-semibold text-white mb-3">Political Systems Analysis</h4>
              <p className="text-blue-100">
                Analyze governance structures using historical data and predict optimal political frameworks 
                for your nation's unique conditions.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <BarChart3 className="h-8 w-8 text-purple-400 mb-4" />
              <h4 className="text-xl font-semibold text-white mb-3">Economic Integration</h4>
              <p className="text-blue-100">
                Discover the financial systems that best support your governance model for sustained 
                economic growth and stability.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <FileText className="h-8 w-8 text-green-400 mb-4" />
              <h4 className="text-xl font-semibold text-white mb-3">Constitution Generation</h4>
              <p className="text-blue-100">
                Generate complete constitutional documents with legal frameworks, rights, and 
                governance structures tailored to your specifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nation Scenarios Showcase */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Explore Different Nation Scenarios
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Utopia Nation */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:transform hover:scale-105 transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="People in a utopian society with advanced sustainable technology and happy communities"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Utopia
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold text-white mb-3">Perfect Harmony</h4>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Pefect your advanced sustainable nation where technology serves humanity, resources are abundant, 
                  and citizens thrive in peaceful, prosperous communities with fair and frugal governance.
                </p>
              </div>
            </div>

            {/* Dystopia Nation */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:transform hover:scale-105 transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/2448749/pexels-photo-2448749.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="People in a dystopian future with urban decay, surveillance, and authoritarian control"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Dystopia
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold text-white mb-3">Cautionary Future</h4>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Launch an authoritarian surveillance state where freedom is restricted and resources are metered, but citizens have greater reliance on government and each other as most needs are met.
                </p>
              </div>
            </div>

            {/* Mars Colony */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:transform hover:scale-105 transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="Astronauts and colonists working together in a Mars colony with futuristic habitats and red landscape"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Mars
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold text-white mb-3">New Frontiers</h4>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Build a pioneering colony on Mars where humanity adapts to extreme environments, develops 
                  innovative governance for space habitats, and creates a self-sustaining society.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <LeaderboardSection 
        onViewNation={handleViewLeaderboardNation}
        user={user}
        onLogin={onLogin}
      />

      {/* Key Metrics Preview */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Data-Driven Governance Insights
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Resource Efficiency</h4>
              <p className="text-blue-100 text-sm">Optimal allocation of physical and social capital</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Scale className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Rights Protection</h4>
              <p className="text-blue-100 text-sm">Balance of individual vs collective rights</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Adaptability Score</h4>
              <p className="text-blue-100 text-sm">System evolution and crisis response capability</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Social Cohesion</h4>
              <p className="text-blue-100 text-sm">Cultural integration and conflict resolution</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-blue-200">
            Powered by historical analysis and AI-driven governance optimization
          </p>
        </div>
      </footer>

      {/* Shared Nation Modal */}
      {showSharedNation && sharedNation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="h-6 w-6 text-white" />
                <h2 className="text-xl font-bold text-white">{sharedNation.name}</h2>
              </div>
              <button
                onClick={() => setShowSharedNation(false)}
                className="text-white hover:text-blue-200 transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">Population</h4>
                    <p className="text-gray-600">{sharedNation.assessmentData.population.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Territory</h4>
                    <p className="text-gray-600">{sharedNation.assessmentData.territory.toLocaleString()} km²</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Location</h4>
                    <p className="text-gray-600">{sharedNation.assessmentData.location}</p>
                  </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Economic Model</h4>
                  <p className="text-gray-600">{sharedNation.assessmentData.economicModel}</p>
                </div>
                  <div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Social Organization</h4>
                  <p className="text-gray-600">
                    {Array.isArray(sharedNation.assessmentData.socialOrganization) 
                      ? sharedNation.assessmentData.socialOrganization.join(', ')
                      : sharedNation.assessmentData.socialOrganization}
                  </p>
                </div>
                    <h4 className="font-semibold text-gray-800">Political System</h4>
                {sharedNation.assessmentData.environmentalChallenges?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Environmental Challenges</h4>
                    <div className="flex flex-wrap gap-2">
                      {sharedNation.assessmentData.environmentalChallenges.map((challenge: string) => (
                        <span key={challenge} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                          {challenge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                    <p className="text-gray-600">{sharedNation.assessmentData.politicalStructure}</p>
                {sharedNation.customPolicies && Object.keys(sharedNation.customPolicies).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Custom Policies</h4>
                    <div className="space-y-2">
                      {Object.entries(sharedNation.customPolicies).map(([key, value]) => (
                        value && (
                          <div key={key} className="bg-gray-50 p-3 rounded-lg">
                            <h5 className="font-medium text-gray-700 capitalize">{key}</h5>
                            <p className="text-gray-600 text-sm mt-1">{value as string}</p>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
                  </div>
                <div className="text-sm text-gray-500 pt-4 border-t">
                  Created: {new Date(sharedNation.createdAt).toLocaleDateString()}
                </div>
              </div>
                </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={onStartAssessment}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Create Your Own Nation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}