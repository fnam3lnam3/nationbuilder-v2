import React, { useState } from 'react';
import { Save, LogIn, X } from 'lucide-react';
import { User } from '../types';

interface SaveNationDialogProps {
  user: User | null;
  onSave: (name: string) => Promise<void>;
  onLogin: () => void;
  onClose: () => void;
  isExistingNation?: boolean;
  defaultName?: string;
}

export default function SaveNationDialog({ 
  user, 
  onSave, 
  onLogin, 
  onClose, 
  isExistingNation = false,
  defaultName = ''
}: SaveNationDialogProps) {
  const [nationName, setNationName] = useState(defaultName);
  const [saving, setSaving] = useState(false);
  const [showDontSave, setShowDontSave] = useState(false);

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

  const handleDontSave = () => {
    setShowDontSave(true);
  };

  const confirmDontSave = () => {
    // This will trigger cleanup of temporary data
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

        <div className="flex space-x-3">
          <button
            onClick={handleDontSave}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Don't Save
          </button>
          <button
            onClick={handleSave}
            disabled={!nationName.trim() || saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : (isExistingNation ? 'Update' : 'Save Nation')}
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