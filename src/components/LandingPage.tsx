import React from 'react';
import { ChevronRight, Globe, Scale, FileText, BarChart3, Users, Zap, LogIn, LogOut, BookOpen } from 'lucide-react';
import { User } from '../types';

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
                  Advanced sustainable cities where technology serves humanity, resources are abundant, 
                  and citizens thrive in peaceful, prosperous communities with perfect governance systems.
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
                  Authoritarian surveillance states where freedom is restricted, resources are scarce, 
                  and citizens struggle under oppressive systems that prioritize control over human welfare.
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
                  Pioneering colonies on Mars where humanity adapts to extreme environments, develops 
                  innovative governance for space habitats, and creates self-sustaining interplanetary societies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
}