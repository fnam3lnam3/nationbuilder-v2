import React, { useState, useEffect } from 'react';
import { 
  User, 
  Crown, 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Download, 
  LogOut, 
  Settings, 
  Trophy,
  Globe,
  Calendar,
  X,
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import SavedNations from './SavedNations';
import { SavedNation } from '../types';
import { analytics } from '../utils/analytics';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface UserProfileProps {
  user: any;
  subscription: any;
  savedNations: SavedNation[];
  onLoad: (nation: SavedNation) => void;
  onDelete: (nationId: string) => void;
  onEdit: (nation: SavedNation) => void;
  onLogout: () => void;
  onShowSubscriptionPlans: () => void;
  onBack: () => void;
}

interface PrivacySettings {
  email: boolean;
  createdAt: boolean;
  subscriptionStatus: boolean;
  activityLog: boolean;
}

interface LeaderboardEntry {
  nationId: string;
  nationName: string;
  category: 'Utopia' | 'Dystopia' | 'Mars Colony';
  rank: number;
  duration: string;
}

export default function UserProfile({ 
  user, 
  subscription, 
  savedNations, 
  onLoad, 
  onDelete, 
  onEdit, 
  onLogout,
  onShowSubscriptionPlans,
  onBack 
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'nations' | 'settings'>('overview');
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    email: false,
    createdAt: false,
    subscriptionStatus: false,
    activityLog: false
  });
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [sharedNations, setSharedNations] = useState<SavedNation[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const isPremium = subscription?.subscription_status === 'active';

  useEffect(() => {
    loadLeaderboardData();
    loadSharedNations();
  }, [savedNations]);

  const loadLeaderboardData = async () => {
    // Mock leaderboard data - in real app would query actual leaderboard positions
    const mockEntries: LeaderboardEntry[] = [
      {
        nationId: savedNations[0]?.id || '',
        nationName: savedNations[0]?.name || 'Sample Nation',
        category: 'Utopia',
        rank: 15,
        duration: '2 weeks'
      }
    ];
    setLeaderboardEntries(mockEntries.filter(entry => entry.nationId));
  };

  const loadSharedNations = () => {
    // Filter nations that are public/shared
    const shared = savedNations.filter(nation => nation.isPublic);
    setSharedNations(shared);
  };

  const handlePrivacyToggle = (setting: keyof PrivacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const downloadActivityLog = () => {
    const report = analytics.generateReport();
    const activityData = {
      user: {
        id: user.id,
        username: user.username,
        email: privacySettings.email ? user.email : '[HIDDEN]',
        createdAt: privacySettings.createdAt ? user.createdAt : '[HIDDEN]'
      },
      subscription: {
        status: privacySettings.subscriptionStatus ? (subscription?.subscription_status || 'free') : '[HIDDEN]',
        type: isPremium ? 'Premium' : 'Freemium'
      },
      activity: {
        totalLogins: report.totalLogins,
        averageSessionTime: report.averageSessionTimeMinutes,
        nationsCreated: report.totalNationsCreated,
        lastActivity: new Date().toISOString()
      },
      nations: {
        total: savedNations.length,
        shared: sharedNations.length,
        leaderboardEntries: leaderboardEntries.length
      }
    };

    const content = `USER ACTIVITY LOG\n${'='.repeat(50)}\n\n${JSON.stringify(activityData, null, 2)}\n\nGenerated: ${new Date().toLocaleString()}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.username}-activity-log.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      // In a real app, this would call a Stripe API to cancel the subscription
      // For now, we'll just show the confirmation
      alert('Subscription cancellation request submitted. Your premium features will remain active until the end of your current billing period.');
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again or contact support.');
    } finally {
      setCancelling(false);
    }
  };

  const handleDeleteWithConfirm = (nationId: string) => {
    const nation = savedNations.find(n => n.id === nationId);
    if (!nation) return;
    
    if (window.confirm(`Are you sure you want to delete "${nation.name}"? This action cannot be undone.`)) {
      onDelete(nationId);
    }
  };

  const getPrivacyIcon = (isVisible: boolean, isPublic: boolean = false) => {
    if (isPublic && isVisible) {
      return <Eye className="h-4 w-4 text-blue-600" />;
    } else if (!isPublic && isVisible) {
      return (
        <div className="relative">
          <Eye className="h-4 w-4 text-green-600" />
          <Crown className="h-2 w-2 text-yellow-500 absolute -top-1 -right-1" />
        </div>
      );
    }
    return <Lock className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                    <button
                      onClick={isPremium ? undefined : onShowSubscriptionPlans}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        isPremium 
                          ? 'bg-yellow-500 text-yellow-900 cursor-default' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                      }`}
                    >
                      <Crown className="h-3 w-3" />
                      <span>{isPremium ? 'Premium' : 'Freemium'}</span>
                    </button>
                  </div>
                  <p className="text-blue-100 text-sm">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={onBack}
                className="text-white hover:text-blue-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-8 py-4 border-b border-gray-200">
            <nav className="flex space-x-6">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'nations', label: 'My Nations', icon: Globe },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Account Summary */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Account Information</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">Username:</span>
                    <span className="font-medium">{user.username}</span>
                  </div>
                  <Eye className="h-4 w-4 text-blue-600" title="Always public" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">Email:</span>
                    <span className="font-medium">
                      {privacySettings.email ? user.email : '••••••••@••••••.com'}
                    </span>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('email')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {getPrivacyIcon(privacySettings.email)}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">Member Since:</span>
                    <span className="font-medium">
                      {privacySettings.createdAt ? new Date(user.createdAt).toLocaleDateString() : '••/••/••••'}
                    </span>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('createdAt')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {getPrivacyIcon(privacySettings.createdAt)}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">Subscription:</span>
                    <span className="font-medium">
                      {privacySettings.subscriptionStatus ? (isPremium ? 'Premium' : 'Freemium') : '••••••••'}
                    </span>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('subscriptionStatus')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {getPrivacyIcon(privacySettings.subscriptionStatus)}
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 flex items-center space-x-1">
                  <Lock className="h-3 w-3" />
                  <span>All information is private by default. Click icons to make visible to other users.</span>
                </p>
              </div>
            </div>

            {/* Nations Summary */}
            <div className="space-y-6">
              {/* Shared Nations */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shared Nations</h3>
                {sharedNations.length > 0 ? (
                  <div className="space-y-2">
                    {sharedNations.map(nation => (
                      <div key={nation.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium text-gray-900">{nation.name}</span>
                        <Eye className="h-4 w-4 text-blue-600" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No nations shared publicly yet.</p>
                )}
              </div>

              {/* Leaderboard Entries */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span>Leaderboard</span>
                </h3>
                {leaderboardEntries.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2">Nation</th>
                          <th className="text-left py-2">Category</th>
                          <th className="text-left py-2">Rank</th>
                          <th className="text-left py-2">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboardEntries.map(entry => (
                          <tr key={entry.nationId} className="border-b border-gray-100">
                            <td className="py-2 font-medium">{entry.nationName}</td>
                            <td className="py-2">{entry.category}</td>
                            <td className="py-2">#{entry.rank}</td>
                            <td className="py-2">{entry.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No nations on leaderboard yet. Make a nation public to compete!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nations' && (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <SavedNations
              nations={savedNations}
              onLoad={onLoad}
              onDelete={handleDeleteWithConfirm}
              onEdit={onEdit}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Privacy Settings */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Privacy Settings</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Email Address</div>
                    <div className="text-sm text-gray-500">Show your email to other logged-in users</div>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('email')}
                    className={`p-2 rounded-lg transition-colors ${
                      privacySettings.email ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {privacySettings.email ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Join Date</div>
                    <div className="text-sm text-gray-500">Show when you joined Nationbuilder</div>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('createdAt')}
                    className={`p-2 rounded-lg transition-colors ${
                      privacySettings.createdAt ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {privacySettings.createdAt ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Subscription Status</div>
                    <div className="text-sm text-gray-500">Show if you're a premium member</div>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('subscriptionStatus')}
                    className={`p-2 rounded-lg transition-colors ${
                      privacySettings.subscriptionStatus ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {privacySettings.subscriptionStatus ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Privacy by Default</p>
                    <p>Your username and public nations are always visible. All other information is private unless you choose to share it.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
              
              <div className="space-y-4">
                <button
                  onClick={downloadActivityLog}
                  className="flex items-center space-x-2 w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Download Activity Log</div>
                    <div className="text-sm text-gray-500">Get a copy of your account activity and data</div>
                  </div>
                </button>

                <button
                  onClick={() => setShow2FASetup(true)}
                  className="flex items-center space-x-2 w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Shield className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-500">Add an extra layer of security to your account</div>
                  </div>
                </button>

                {isPremium && (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="flex items-center space-x-2 w-full p-3 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <CreditCard className="h-4 w-4 text-red-600" />
                    <div>
                      <div className="font-medium text-red-900">Cancel Subscription</div>
                      <div className="text-sm text-red-600">End your premium subscription</div>
                    </div>
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Log Out</div>
                    <div className="text-sm text-gray-500">Sign out of your account</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Subscription Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center mb-6">
                <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Cancel Subscription</h3>
                <p className="text-gray-600">
                  Your premium subscription will remain active until the end of your current billing period. 
                  After that, you'll lose access to premium features but keep your saved nations.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>What you'll lose:</strong> Ability to save more than 5 nations, full leaderboard access, 
                  and early access to new features.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2FA Setup Modal */}
        {show2FASetup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center mb-6">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
                <p className="text-gray-600">
                  Two-factor authentication is coming soon! This feature will add an extra layer of security to your account.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  We're working on implementing 2FA with authenticator app support. 
                  You'll be notified when this feature becomes available.
                </p>
              </div>

              <button
                onClick={() => setShow2FASetup(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}