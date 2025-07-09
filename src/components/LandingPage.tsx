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
  origin: boolean;
  ageRange: boolean;
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
    activityLog: false,
    origin: false,
    ageRange: false
  });
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [sharedNations, setSharedNations] = useState<SavedNation[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCancelDetails, setShowCancelDetails] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const isPremium = subscription?.subscription_status === 'active';
  const subscriptionEndDate = subscription?.current_period_end 
    ? new Date(subscription.current_period_end * 1000).toLocaleDateString()
    : null;

  // Calculate age range based on user's age
  const getAgeRange = (age: number): string => {
    if (age < 18) return 'Minor under 18 years old';
    if (age <= 23) return '18 - 23 years old';
    if (age <= 27) return '24 - 27 years old';
    if (age <= 30) return '28 - 30 years old';
    if (age <= 35) return '31 - 35 years old';
    if (age <= 40) return '36 - 40 years old';
    if (age <= 45) return '41 - 45 years old';
    if (age <= 50) return '46 - 50 years old';
    if (age <= 55) return '51 - 55 years old';
    if (age <= 60) return '56 - 60 years old';
    if (age <= 65) return '61 - 65 years old';
    if (age <= 70) return '66 - 70 years old';
    if (age <= 75) return '71 - 75 years old';
    if (age <= 80) return '76 - 80 years old';
    if (age <= 89) return '81 - 89 years old';
    if (age <= 99) return '90 - 99 years old';
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-white" />
                  <h2 className="text-xl font-bold text-white">Subscription Cancellation Details</h2>
                </div>
                <button
                  onClick={() => setShowCancelDetails(false)}
                  className="text-white hover:text-red-200 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens when you cancel?</h3>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-2">
                      <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Your subscription will remain active until:</p>
                        <p className="text-blue-800 text-lg font-semibold">
                          {subscriptionEndDate || 'End of current billing period'}
                        </p>
                        <p className="text-blue-700 text-sm mt-1">
                          You'll continue to have full access to all premium features until this date.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-red-900 mb-2">After cancellation, you will lose:</h4>
                    <ul className="space-y-1 text-red-800 text-sm">
                      <li>• Ability to save more than 5 nations (current: {savedNations.length}/30)</li>
                      <li>• Access to full leaderboards (top 30 in each category)</li>
                      <li>• Early access to new features</li>
                      <li>• Premium support priority</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-green-900 mb-2">What you'll keep:</h4>
                    <ul className="space-y-1 text-green-800 text-sm">
                      <li>• All your currently saved nations (up to 5 will remain accessible)</li>
                      <li>• Basic leaderboard access (top 5 in each category)</li>
                      <li>• Full nation building and analysis features</li>
                      <li>• Account data and privacy settings</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">Important Notes:</p>
                        <ul className="text-yellow-800 text-sm mt-1 space-y-1">
                          <li>• No refunds are available for pre-paid subscription periods</li>
                          <li>• If you have more than 5 saved nations, you'll need to choose which 5 to keep</li>
                          <li>• You can reactivate your subscription at any time</li>
                          <li>• Cancellation takes effect at the end of your current billing cycle</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {savedNations.length > 5 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-orange-900">Action Required:</p>
                          <p className="text-orange-800 text-sm mt-1">
                            You currently have {savedNations.length} saved nations. After cancellation, 
                            you'll need to choose which 5 nations to keep. The system will automatically 
                            keep your 5 most recently updated nations unless you specify otherwise.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCancelDetails(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors font-medium"
                  >
                    Keep My Subscription
                  </button>
                  <button
                    onClick={() => {
                      setShowCancelDetails(false);
                      setShowCancelConfirm(true);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                  >
                    Proceed to Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Final Cancellation Confirmation Modal */}
    if (age <= 110) return '100 - 110 years old';
    return '111+ years old';
  };

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
    
    // Create bulleted summary
    const summary = [
      `• User: ${user.username} (${privacySettings.email ? user.email : '[HIDDEN]'})`,
      `• Account Type: ${isPremium ? 'Premium' : 'Freemium'}`,
      `• Member Since: ${privacySettings.createdAt ? new Date(user.createdAt).toLocaleDateString() : '[HIDDEN]'}`,
      `• Total Logins: ${report.totalLogins}`,
      `• Average Session Time: ${report.averageSessionTimeMinutes} minutes`,
      `• Nations Created: ${report.totalNationsCreated}`,
      `• Saved Nations: ${savedNations.length}/${isPremium ? 30 : 5}`,
      `• Public Nations: ${sharedNations.length}`,
      `• Leaderboard Entries: ${leaderboardEntries.length}`,
      `• Privacy Settings: ${Object.entries(privacySettings).filter(([_, visible]) => visible).length} fields visible`,
      `• Last Activity: ${new Date().toLocaleString()}`
    ];
    
    const activityData = {
      user: {
        id: user.id,
        username: user.username,
        email: privacySettings.email ? user.email : '[HIDDEN]',
        createdAt: privacySettings.createdAt ? user.createdAt : '[HIDDEN]',
        city: privacySettings.origin ? user.city : '[HIDDEN]',
        country: privacySettings.origin ? user.country : '[HIDDEN]',
        ageRange: privacySettings.ageRange ? getAgeRange(user.age) : '[HIDDEN]'
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

    const content = `USER ACTIVITY LOG
${'='.repeat(50)}

SUMMARY
${summary.join('\n')}

DETAILED DATA
${'='.repeat(50)}
${JSON.stringify(activityData, null, 2)}

Generated: ${new Date().toLocaleString()}
Report Type: User Activity Log with Privacy Controls
Data Source: Nationbuilder Analytics System`;
    
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Call Stripe to cancel subscription at period end
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-cancel-subscription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription_id: subscription?.subscription_id
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to cancel subscription');
      }

      setShowCancelConfirm(false);
      setShowCancelDetails(false);
      setShowCancelSuccess(true);
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">Origin:</span>
                    <span className="font-medium">
                      {privacySettings.origin ? `${user.city}, ${user.country}` : '••••••, ••••••'}
                    </span>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('origin')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {getPrivacyIcon(privacySettings.origin)}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">Age Range:</span>
                    <span className="font-medium">
                      {privacySettings.ageRange ? getAgeRange(user.age) : '•• - •• years old'}
                    </span>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('ageRange')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {getPrivacyIcon(privacySettings.ageRange)}
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

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Origin</div>
                    <div className="text-sm text-gray-500">Show your city and country to other logged-in users</div>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('origin')}
                    className={`p-2 rounded-lg transition-colors ${
                      privacySettings.origin ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {privacySettings.origin ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Age Range</div>
                    <div className="text-sm text-gray-500">Show your age range to other logged-in users only (never public)</div>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('ageRange')}
                    className={`p-2 rounded-lg transition-colors ${
                      privacySettings.ageRange ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {privacySettings.ageRange ? (
                      <div className="relative">
                        <Unlock className="h-4 w-4" />
                        <Crown className="h-2 w-2 text-yellow-500 absolute -top-1 -right-1" />
                      </div>
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Privacy by Default</p>
                    <p>Your username and public nations are always visible. All other information is private unless you choose to share it. Age range is never shown publicly, only to other logged-in users.</p>
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

                {isPremium && (
                  <button
                    onClick={() => setShowCancelDetails(true)}
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
        {showCancelDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-white" />
                  <h2 className="text-xl font-bold text-white">Subscription Cancellation Details</h2>
                </div>
                <button
                  onClick={() => setShowCancelDetails(false)}
                  className="text-white hover:text-red-200 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens when you cancel?</h3>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-2">
                      <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Your subscription will remain active until:</p>
                        <p className="text-blue-800 text-lg font-semibold">
                          {subscriptionEndDate || 'End of current billing period'}
                        </p>
                        <p className="text-blue-700 text-sm mt-1">
                          You'll continue to have full access to all premium features until this date.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-red-900 mb-2">After cancellation, you will lose:</h4>
                    <ul className="space-y-1 text-red-800 text-sm">
                      <li>• Ability to save more than 5 nations (current: {savedNations.length}/30)</li>
                      <li>• Access to full leaderboards (top 30 in each category)</li>
                      <li>• Early access to new features</li>
                      <li>• Premium support priority</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-green-900 mb-2">What you'll keep:</h4>
                    <ul className="space-y-1 text-green-800 text-sm">
                      <li>• All your currently saved nations (up to 5 will remain accessible)</li>
                      <li>• Basic leaderboard access (top 5 in each category)</li>
                      <li>• Full nation building and analysis features</li>
                      <li>• Account data and privacy settings</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">Important Notes:</p>
                        <ul className="text-yellow-800 text-sm mt-1 space-y-1">
                          <li>• No refunds are available for pre-paid subscription periods</li>
                          <li>• If you have more than 5 saved nations, you'll need to choose which 5 to keep</li>
                          <li>• You can reactivate your subscription at any time</li>
                          <li>• Cancellation takes effect at the end of your current billing cycle</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {savedNations.length > 5 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-orange-900">Action Required:</p>
                          <p className="text-orange-800 text-sm mt-1">
                            You currently have {savedNations.length} saved nations. After cancellation, 
                            you'll need to choose which 5 nations to keep. The system will automatically 
                            keep your 5 most recently updated nations unless you specify otherwise.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Undeployed Help Desk Section - Hidden but ready for future deployment */}
                <div className="hidden">
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Need Help?</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <HelpCircle className="h-4 w-4 text-gray-500" />
                        <a href="#" className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                          <span>Contact Help Desk</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-gray-500" />
                        <a href="#" className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                          <span>Terms of Service</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-gray-500" />
                        <a href="#" className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                          <span>Privacy Policy</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCancelDetails(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors font-medium"
                  >
                    Keep My Subscription
                  </button>
                  <button
                    onClick={() => {
                      setShowCancelDetails(false);
                      setShowCancelConfirm(true);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                  >
                    Proceed to Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Final Cancellation Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center mb-6">
                <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Final Confirmation</h3>
                <p className="text-gray-600">
                  Are you absolutely sure you want to cancel your Nationleader subscription?
                </p>
              </div>

                  Are you absolutely sure you want to cancel your Nationleader subscription?
                  This action will:
                </p>
                <ul className="text-red-700 text-sm space-y-1">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm font-medium mb-2">
                  This action will:
                </p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Cancel your subscription at the end of the current billing period ({subscriptionEndDate})</li>
                  <li>• Remove access to premium features after that date</li>
                  <li>• Limit you to 5 saved nations instead of 30</li>
                  <li>• Cannot be undone (though you can resubscribe later)</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors font-medium"
                >
                  No, Keep My Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                >
                  {cancelling ? 'Processing...' : 'Yes, Cancel Subscription'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Success Modal */}
        {showCancelSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Subscription Cancelled</h3>
                <p className="text-gray-600">
                  Your subscription has been successfully cancelled and will not renew.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <p className="font-medium text-blue-900 mb-1">Premium access continues until:</p>
                  <p className="text-blue-800 text-lg font-semibold">
                    {subscriptionEndDate}
                  </p>
                  <p className="text-blue-700 text-sm mt-2">
                    You'll receive an email confirmation with all the details.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCancelSuccess(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Cancellation Success Modal */}
        {showCancelSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Subscription Cancelled</h3>
                <p className="text-gray-600">
                  Your subscription has been successfully cancelled and will not renew.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <p className="font-medium text-blue-900 mb-1">Premium access continues until:</p>
                  <p className="text-blue-800 text-lg font-semibold">
                    {subscriptionEndDate}
                  </p>
                  <p className="text-blue-700 text-sm mt-2">
                    You'll receive an email confirmation with all the details.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCancelSuccess(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
              >
                Continue
              </button>
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