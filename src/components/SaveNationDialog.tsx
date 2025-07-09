import React, { useState } from 'react';
import { Save, LogIn, X, Trash2, Crown, AlertTriangle } from 'lucide-react';
import { User, SavedNation } from '../types';

interface SaveNationDialogProps {
  user: User | null;
  onSave: (name: string) => Promise<void>;
  onLogin: () => void;
  onClose: () => void;
  isExistingNation?: boolean;
  defaultName?: string;
  savedNations?: SavedNation[];
  maxNations?: number;
  onDeleteNation?: (nationId: string) => Promise<void>;
  onUpgrade?: () => void;
  subscription?: any;
}

export default function SaveNationDialog({ 
  user, 
  onSave, 
  onLogin, 
  onClose, 
  isExistingNation = false,
  defaultName = '',
  savedNations = [],
  maxNations = 5,
  onDeleteNation,
  onUpgrade,
  subscription
}: SaveNationDialogProps) {
  const [nationName, setNationName] = useState(defaultName);
  const [saving, setSaving] = useState(false);
  const [showDontSave, setShowDontSave] = useState(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [showUpgradeOption, setShowUpgradeOption] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isPremium = subscription?.subscription_status === 'active';
  const isAtLimit = savedNations.length >= maxNations;
  const canSaveMore = !isAtLimit || isExistingNation;

  const handleSave = async () => {
    if (!nationName.trim()) return;

    setSaving(true);
    try {
      await onSave(nationName.trim());
      onClose();
    } catch (error: any) {
      alert(error.message || 'Failed to save nation');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAndSave = async () => {
    if (!selectedForDeletion || !nationName.trim()) return;

    setDeleting(true);
    try {
      // First delete the selected nation
      if (onDeleteNation) {
        await onDeleteNation(selectedForDeletion);
      }
      
      // Then save the new nation
      await onSave(nationName.trim());
      onClose();
    } catch (error: any) {
      alert(error.message || 'Failed to delete nation and save new one');
    } finally {
      setDeleting(false);
    }
  };

  const handleUpgradeAndSave = () => {
    if (onUpgrade) {
      // Store the nation name in session storage so we can restore it after upgrade
      sessionStorage.setItem('pendingNationName', nationName.trim());
      sessionStorage.setItem('pendingNationSave', 'true');
      onUpgrade();
    }
  };

  const handleDontSave = () => {
    setShowDontSave(true);
  };

  const confirmDontSave = () => {
    onClose();
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <Save className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Save Your Nation Analysis
            </h3>
            <p className="text-gray-600">
              Sign in to save your nation and access it later, or continue without saving.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={onLogin}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In to Save</span>
            </button>
            
            <button
              onClick={handleDontSave}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors"
            >
              Continue Without Saving
            </button>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  if (showDontSave) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Don't Save This Nation?
            </h3>
            <p className="text-gray-600">
              Your assessment data and analysis will be permanently deleted. This action cannot be undone.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowDontSave(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Keep Nation
            </button>
            <button
              onClick={confirmDontSave}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Delete Forever
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showDeleteOptions && !isPremium && isAtLimit && !isExistingNation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <Trash2 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Choose Nation to Replace
            </h3>
            <p className="text-gray-600">
              You've reached your limit of {maxNations} saved nations. Select one to delete and replace with "{nationName}".
            </p>
          </div>

          <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
            {savedNations.map((nation) => (
              <div
                key={nation.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedForDeletion === nation.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedForDeletion(nation.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{nation.name}</div>
                    <div className="text-sm text-gray-500">
                      Created: {new Date(nation.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {nation.assessmentData.politicalStructure} • Pop: {nation.assessmentData.population.toLocaleString()}
                    </div>
                  </div>
                  {selectedForDeletion === nation.id && (
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">This will permanently delete the selected nation</p>
                <p>Consider upgrading to Premium to save up to 30 nations instead.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDeleteAndSave}
              disabled={!selectedForDeletion || deleting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {deleting ? 'Deleting & Saving...' : 'Delete Selected & Save New Nation'}
            </button>
            
            <button
              onClick={() => setShowUpgradeOption(true)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Upgrade to Premium Instead
            </button>
            
            <button
              onClick={() => setShowDeleteOptions(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  if (showUpgradeOption && !isPremium) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <Crown className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Upgrade to Premium
            </h3>
            <p className="text-gray-600">
              Save "{nationName}" and up to 30 total nations with a Premium subscription.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border border-blue-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">$2.99/month</div>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Save up to 30 nations (vs 5 for free)</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Full leaderboard access</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Early access to new features</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <Save className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Your nation assessment will be preserved</p>
                <p>After upgrading, you'll return here to save "{nationName}" without losing any progress.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleUpgradeAndSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              Upgrade & Save Nation
            </button>
            
            <button
              onClick={() => setShowUpgradeOption(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Back to Delete Options
            </button>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <Save className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isExistingNation ? 'Update Nation' : 'Save Your Nation'}
          </h3>
          <p className="text-gray-600">
            {isExistingNation 
              ? 'Update your saved nation with the latest changes.'
              : 'Give your nation a name to save it to your collection.'
            }
          </p>
          
          {!isPremium && !isExistingNation && (
            <div className="mt-3 text-sm text-gray-500">
              {savedNations.length}/{maxNations} nations saved
              {isAtLimit && (
                <span className="text-orange-600 font-medium"> (Limit reached)</span>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nation Name
          </label>
          <input
            type="text"
            value={nationName}
            onChange={(e) => setNationName(e.target.value)}
            placeholder="Enter nation name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>

        {/* Show options based on user status and limits */}
        {canSaveMore ? (
          <div className="space-y-3">
            <button
              onClick={handleSave}
              disabled={!nationName.trim() || saving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : (isExistingNation ? 'Update Nation' : 'Save Nation')}
            </button>
            
            <button
              onClick={handleDontSave}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Don't Save
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* At limit - show upgrade or delete options */}
            {!isPremium && (
              <button
                onClick={() => setShowUpgradeOption(true)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900 px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <Crown className="h-4 w-4" />
                <span>Upgrade to Save More Nations</span>
              </button>
            )}
            
            <button
              onClick={() => setShowDeleteOptions(true)}
              disabled={!nationName.trim()}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Existing Nation to Save This One</span>
            </button>
            
            <button
              onClick={handleDontSave}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Don't Save
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}