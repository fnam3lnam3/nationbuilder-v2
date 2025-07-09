import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { AssessmentData, CustomPolicies } from '../types';
import { 
  Globe, 
  Users, 
  Building, 
  Leaf, 
  Zap, 
  GraduationCap, 
  Shield, 
  Heart, 
  TrendingUp,
  Edit3,
  ArrowLeft,
  RotateCcw,
  Save,
  LogIn
} from 'lucide-react';

interface ResultsDashboardProps {
  assessmentData: AssessmentData;
  customPolicies?: CustomPolicies;
  onBack: () => void;
  onStartNew: () => void;
  onPolicyUpdate: (policies: CustomPolicies) => void;
  user: User | null;
  onLogin: () => void;
  onSaveNation: (name: string, assessmentData: AssessmentData, customPolicies: CustomPolicies) => Promise<void>;
  isExistingNation?: boolean;
}

const getActualEconomicSystem = (data: AssessmentData): string => {
  if (data.resources >= 8 && data.location === 'Space habitat') {
    return 'Post-Scarcity Resource Distribution Economy';
  }
  if (data.technologyLevel >= 8 && data.educationLevel >= 7) {
    return 'AI-Optimized Mixed Economy with Universal Basic Assets';
  }
  if (data.resources <= 3 && data.environmentalChallenges.length > 4) {
    return 'Survival-Focused Command Economy with Market Elements';
  }
  if (data.population < 100000 && data.socialOrganization.includes('Communalism')) {
    return 'Cooperative Community Economy with Limited Markets';
  }
  return 'Regulated Market Economy with Strong Social Safety Net';
};

const getGovernmentType = (data: AssessmentData): string => {
  if (data.location === 'Space habitat') {
    return 'Technocratic Council with Democratic Input';
  }
  if (data.population < 50000) {
    return 'Direct Democracy with Council of Elders';
  }
  if (data.technologyLevel >= 7) {
    return 'Digital Democracy with AI-Assisted Governance';
  }
  if (data.environmentalChallenges.length > 3) {
    return 'Emergency Council with Democratic Oversight';
  }
  return 'Constitutional Republic with Strong Local Autonomy';
};

const getSocialStructure = (data: AssessmentData): string => {
  if (data.socialOrganization.includes('Egalitarian')) {
    return 'Classless Society with Merit-Based Roles';
  }
  if (data.socialOrganization.includes('Hierarchical')) {
    return 'Structured Meritocracy with Social Mobility';
  }
  if (data.socialOrganization.includes('Communalism')) {
    return 'Community-Centered Collective with Shared Responsibilities';
  }
  return 'Flexible Social Network with Individual Choice';
};

const getCulturalValues = (data: AssessmentData): string[] => {
  const values = [];
  
  if (data.socialOrganization.includes('Egalitarian')) {
    values.push('Equality and Fair Distribution');
  }
  if (data.socialOrganization.includes('Innovation-focused')) {
    values.push('Scientific Progress and Discovery');
  }
  if (data.socialOrganization.includes('Communalism')) {
    values.push('Community Solidarity and Mutual Aid');
  }
  if (data.environmentalChallenges.length > 2) {
    values.push('Environmental Stewardship');
  }
  if (data.technologyLevel >= 6) {
    values.push('Technological Integration');
  }
  if (data.educationLevel >= 7) {
    values.push('Knowledge and Learning');
  }
  
  return values.length > 0 ? values : ['Individual Freedom', 'Community Harmony', 'Sustainable Progress'];
};

const getRecommendedPolicies = (data: AssessmentData): string[] => {
  const policies = [];
  
  if (data.resources <= 4) {
    policies.push('Resource Conservation Initiative');
    policies.push('Efficient Distribution Network');
  }
  
  if (data.environmentalChallenges.length > 2) {
    policies.push('Environmental Protection Act');
    policies.push('Renewable Energy Transition');
  }
  
  if (data.population > 500000) {
    policies.push('Urban Planning and Infrastructure');
    policies.push('Public Transportation System');
  }
  
  if (data.technologyLevel >= 6) {
    policies.push('Digital Infrastructure Development');
    policies.push('AI Ethics and Regulation');
  }
  
  if (data.educationLevel <= 5) {
    policies.push('Universal Education Program');
    policies.push('Adult Learning and Reskilling');
  }
  
  return policies;
};

export default function ResultsDashboard({ 
  assessmentData, 
  customPolicies = {}, 
  onBack, 
  onStartNew, 
  onPolicyUpdate,
  user,
  onLogin,
  onSaveNation,
  isExistingNation = false
}: ResultsDashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPolicies, setEditedPolicies] = useState<CustomPolicies>(customPolicies);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [nationName, setNationName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const economicSystem = getActualEconomicSystem(assessmentData);
  const governmentType = getGovernmentType(assessmentData);
  const socialStructure = getSocialStructure(assessmentData);
  const culturalValues = getCulturalValues(assessmentData);
  const recommendedPolicies = getRecommendedPolicies(assessmentData);

  const handleSaveChanges = () => {
    onPolicyUpdate(editedPolicies);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedPolicies(customPolicies);
    setIsEditing(false);
  };

  const handleSaveNation = async () => {
    if (!nationName.trim()) return;
    
    setIsSaving(true);
    try {
      await onSaveNation(nationName, assessmentData, editedPolicies);
      setShowSaveDialog(false);
      setNationName('');
    } catch (error) {
      console.error('Failed to save nation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, description }: {
    icon: React.ComponentType<any>;
    title: string;
    value: string | number;
    description?: string;
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  );

  const PolicySection = ({ title, policies, category }: {
    title: string;
    policies: string[];
    category: keyof CustomPolicies;
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-600" />
        {title}
      </h3>
      <div className="space-y-3">
        {policies.map((policy, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedPolicies[category]?.[index] || policy}
                  onChange={(e) => {
                    const newPolicies = { ...editedPolicies };
                    if (!newPolicies[category]) newPolicies[category] = [...policies];
                    newPolicies[category]![index] = e.target.value;
                    setEditedPolicies(newPolicies);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <span className="text-gray-700">
                  {editedPolicies[category]?.[index] || policy}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Nation Analysis</h1>
            <p className="text-gray-600">Based on your assessment responses</p>
          </div>
          <div className="flex items-center gap-3">
            {!user && (
              <button
                onClick={onLogin}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login to Save
              </button>
            )}
            {user && !isExistingNation && (
              <button
                onClick={() => setShowSaveDialog(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Nation
              </button>
            )}
            <button
              onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? 'Save Changes' : 'Edit Policies'}
            </button>
            {isEditing && (
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Population"
            value={assessmentData.population.toLocaleString()}
            description="Total citizens"
          />
          <StatCard
            icon={Globe}
            title="Location"
            value={assessmentData.location}
            description="Geographic setting"
          />
          <StatCard
            icon={Zap}
            title="Technology Level"
            value={`${assessmentData.technologyLevel}/10`}
            description="Innovation index"
          />
          <StatCard
            icon={Leaf}
            title="Resources"
            value={`${assessmentData.resources}/10`}
            description="Abundance level"
          />
        </div>

        {/* System Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building className="w-6 h-6 text-blue-600" />
              System Analysis
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Economic System</h3>
                <p className="text-gray-900 bg-blue-50 p-3 rounded-lg">{economicSystem}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Government Type</h3>
                <p className="text-gray-900 bg-green-50 p-3 rounded-lg">{governmentType}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Social Structure</h3>
                <p className="text-gray-900 bg-purple-50 p-3 rounded-lg">{socialStructure}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              Cultural Values
            </h2>
            <div className="space-y-3">
              {culturalValues.map((value, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Environmental Challenges */}
        {assessmentData.environmentalChallenges.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-600" />
              Environmental Challenges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assessmentData.environmentalChallenges.map((challenge, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-gray-900">{challenge}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Policy Recommendations */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Policy Framework
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PolicySection
              title="Recommended Policies"
              policies={recommendedPolicies}
              category="recommended"
            />
            <PolicySection
              title="Custom Policies"
              policies={editedPolicies.custom || ['Add your own policies...']}
              category="custom"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Assessment
          </button>
          <button
            onClick={onStartNew}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Start New Assessment
          </button>
        </div>
      </div>

      {/* Save Nation Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Save Your Nation</h3>
            <input
              type="text"
              value={nationName}
              onChange={(e) => setNationName(e.target.value)}
              placeholder="Enter nation name..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveNation}
                disabled={!nationName.trim() || isSaving}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Nation'}
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}