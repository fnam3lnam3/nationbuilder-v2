import React from 'react';
import { ArrowRight, Globe, Users, Trophy, Crown, Zap } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Build Your Perfect Nation
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Design governance systems, analyze political structures, and explore the future of civilization with AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Start Building</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={onLogin}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Nation Building Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From small communities to galactic empires, design and analyze any form of governance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Design</h3>
              <p className="text-gray-600">
                Configure every aspect from population and resources to legal frameworks and social structures.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Get detailed insights on governance effectiveness, economic stability, and social cohesion.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Features</h3>
              <p className="text-gray-600">
                Share your nations, compete on leaderboards, and compare with historical examples.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Compete & Compare
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how your nations rank against others in different categories.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Crown className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Utopian Leaders</h3>
              </div>
              <p className="text-green-100 text-sm">
                Nations with the highest quality of life, democratic governance, and sustainable practices.
              </p>
            </div>

            <div className="bg-red-600 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Dystopian Powers</h3>
              </div>
              <p className="text-red-100 text-sm">
                Authoritarian regimes with high control, surveillance, and centralized power structures.
              </p>
            </div>

            <div className="bg-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Trophy className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Mars Pioneers</h3>
              </div>
              <p className="text-orange-100 text-sm">
                Space-based colonies optimized for survival in harsh environments and resource scarcity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Shape the Future?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users exploring governance, politics, and the future of human civilization.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors inline-flex items-center space-x-2"
          >
            <span>Start Your Nation Today</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}