import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { AssessmentData } from '../types';

interface AssessmentFormProps {
  onComplete: (data: AssessmentData) => void;
  onBack: () => void;
  initialData?: AssessmentData | null;
}

export default function AssessmentForm({ onComplete, onBack, initialData }: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AssessmentData>({
    population: 1000000,
    territory: 50,
    resources: 5,
    climate: [],
    languages: 1,
    religiousDiversity: 5,
    educationLevel: 5,
    technologyLevel: 5,
    location: '',
    environmentalChallenges: [],
    economicModel: '',
    politicalStructure: '',
    socialOrganization: [],
    educationSystem: [],
    healthcare: [],
    security: [],
    resourceManagement: [],
    security: [],
    resourceManagement: [],
    legalFramework: []
  });

  // Load initial data if editing existing nation
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const totalSteps = 5;

  const handleInputChange = (field: keyof AssessmentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: keyof AssessmentData, value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleInputChange(field, newArray);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Validate required fields
      const requiredFields = {
        location: 'Location Type',
        economicModel: 'Economic Model',
        politicalStructure: 'Political Structure',
        socialOrganization: 'Social Organization (at least one)'
      };
      
      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => {
          const value = formData[key as keyof AssessmentData];
          if (key === 'socialOrganization') {
            return !Array.isArray(value) || value.length === 0;
          }
          return !value;
        })
        .map(([, label]) => label);
      
      if (missingFields.length > 0) {
        alert(`Please complete the following required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      // Ensure arrays are properly initialized
      const completeFormData = {
        ...formData,
        climate: formData.climate || [],
        environmentalChallenges: formData.environmentalChallenges || [],
        educationSystem: formData.educationSystem || [],
        healthcare: formData.healthcare || [],
        security: formData.security || [],
        resourceManagement: formData.resourceManagement || [],
        socialOrganization: formData.socialOrganization || [],
        legalFramework: formData.legalFramework || []
      };
      
      console.log('Submitting assessment data:', completeFormData);
      
      // Additional validation before submission
      if (!completeFormData.location || !completeFormData.economicModel || 
          !completeFormData.politicalStructure || !Array.isArray(completeFormData.socialOrganization) || 
          completeFormData.socialOrganization.length === 0) {
        console.error('Critical validation failed:', completeFormData);
        alert('Assessment data is incomplete. Please review all steps.');
        return;
      }
      
      onComplete(completeFormData);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Basic Nation Parameters</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Population Size: {formData.population.toLocaleString()}
              </label>
              <input
                type="range"
                min="1000"
                max="1000000000"
                value={formData.population}
                onChange={(e) => handleInputChange('population', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1K</span>
                <span>1B</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Territory Size (km²): {formData.territory.toLocaleString()}
              </label>
              <p className="text-xs text-gray-500 mb-2">For reference, the USA has close to 9,150,000 sq. km.</p>
              
              {/* Direct input field */}
              <div className="mb-3">
                <input
                  type="number"
                  min="1"
                  max="900000000"
                  value={formData.territory}
                  onChange={(e) => {
                    const value = Math.max(1, Math.min(900000000, parseInt(e.target.value) || 1));
                    handleInputChange('territory', value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                  placeholder="Enter territory size in km²"
                />
              </div>
              
              {/* Slider */}
              <input
                type="range"
                min="1"
                max="900000000"
                value={formData.territory}
                onChange={(e) => handleInputChange('territory', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 km²</span>
                <span>900M km²</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Richness for self-sufficiency: {formData.resources}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.resources}
                onChange={(e) => handleInputChange('resources', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Climate Types</label>
              <div className="grid grid-cols-2 gap-3">
                {['Temperate', 'Tropical', 'Arid', 'Arctic', 'Coastal', 'Landlocked', 'Landlocked with Navigable River'].map(climate => (
                  <label key={climate} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.climate.includes(climate)}
                      onChange={() => handleArrayToggle('climate', climate)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{climate}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Cultural Factors</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Primary Languages Spoken: {formData.languages}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={formData.languages}
                onChange={(e) => handleInputChange('languages', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Religious Diversity (number of major religions): {formData.religiousDiversity}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.religiousDiversity}
                onChange={(e) => handleInputChange('religiousDiversity', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Level: {formData.educationLevel}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.educationLevel}
                onChange={(e) => handleInputChange('educationLevel', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technology Level: {formData.technologyLevel}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.technologyLevel}
                onChange={(e) => handleInputChange('technologyLevel', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Location & Environment</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Location Type</label>
              <div className="space-y-2">
                {['Earth-based','Underwater', 'Virtual/Digital', 'Planetary colony', 'Space station or space-traveling coommunity'].map(location => (
                  <label key={location} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="location"
                      value={location}
                      checked={formData.location === location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Environmental Challenges</label>
              <div className="grid grid-cols-2 gap-3">
                {['Polluted agricultural lands', 'Polluted urban lands','Water scarcity', 'Air quality issues', 'High radiation', 'Climate instability', 'Natural disasters', 'Limited space', 'Energy scarcity', 'harsh climate', 'Food insecurity'].map(challenge => (
                  <label key={challenge} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.environmentalChallenges.includes(challenge)}
                      onChange={() => handleArrayToggle('environmentalChallenges', challenge)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{challenge}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Governance Structure</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Economic Model</label>
              <div className="space-y-2">
                {['Free market', 'Regulated market', 'Communistic','Feudal', 'Barter', 'AI-managed', 'Mixed system', 'Uncertain. You pick!'].map(model => (
                  <label key={model} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="economicModel"
                      value={model}
                      checked={formData.economicModel === model}
                      onChange={(e) => handleInputChange('economicModel', e.target.value)}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{model}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Political Structure</label>
              <div className="space-y-2">
                {['Direct democracy', 'Representative democracy', 'Socialism', 'Fascism', 'Populism', 'Monarchy', 'Constitutional monarchy','Theocracy', 'AI-run', 'Martial law/Anarchic', 'Uncertain. You recommend!'].map(structure => (
                  <label key={structure} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="politicalStructure"
                      value={structure}
                      checked={formData.politicalStructure === structure}
                      onChange={(e) => handleInputChange('politicalStructure', e.target.value)}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{structure}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Social Organization and Clout Sources</label>
              <p className="text-sm text-gray-600 mb-3">Check all that apply.</p>
              <div className="grid grid-cols-2 gap-3">
                {['Individualism', 'Communalism', 'Caste heritage', 'Merit-based', 'Wealth-based', 'Knowledge-based', 'Seniority-based', 'Ethical acts-based'].map(org => (
                  <label key={org} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.socialOrganization.includes(org)}
                      onChange={() => handleArrayToggle('socialOrganization', org)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{org}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">System Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Education System (Check all that apply.)</label>
              <div className="grid grid-cols-2 gap-3">
                {['Universal public', 'Private market','Apprenticeship under a master', 'Virtual-remote'].map(system => (
                  <label key={system} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.educationSystem.includes(system)}
                      onChange={() => handleArrayToggle('educationSystem', system)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{system}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Security & Defense Systems (Check all that apply.)</label>
              <div className="grid grid-cols-2 gap-3">
                {['Professional military', 'Citizen militia', 'Police force', 'Border security', 'Cybersecurity', 'Intelligence services', 'Emergency response'].map(security => (
                  <label key={security} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.security.includes(security)}
                      onChange={() => handleArrayToggle('security', security)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{security}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Healthcare System & Access to Services (Check all that apply.)</label>
              <div className="grid grid-cols-2 gap-3">
                {['Universal access', 'Privatized payment', 'Preventive care', 'Mental-health services', 'Emergency response', 'Research-based medicine', 'Cultural medicine'].map(health => (
                  <label key={health} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.healthcare.includes(health)}
                      onChange={() => handleArrayToggle('healthcare', health)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{health}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Resource Management Systems (Check all that apply.)</label>
              <div className="grid grid-cols-2 gap-3">
                {['Water management', 'Energy distribution', 'Food security', 'Waste management', 'Natural resource extraction', 'Environmental protection', 'Infrastructure maintenance'].map(resource => (
                  <label key={resource} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.resourceManagement.includes(resource)}
                      onChange={() => handleArrayToggle('resourceManagement', resource)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{resource}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Legal Framework</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Habeas corpus',
                  'Trial by peers',
                  'Sentencing by peers',
                  'Ability to appeal police actions',
                  'Ability to appeal judicial judgments',
                  'Ability to lobby lawmakers directly',
                  'Punishment for graft',
                  'Executive power as final authority',
                  'Capital punishment is available',
                  'Incarceration without being read your rights or told your charge',
                  'Eligibility for holding elected roles is based upon more than age',
                  'Referendum is available to remove an elected official',
                  'Referendum can make law'
                ].map(legal => (
                  <label key={legal} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.legalFramework.includes(legal)}
                      onChange={() => handleArrayToggle('legalFramework', legal)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{legal}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </button>
              <h2 className="text-xl font-bold text-white">
                {initialData ? 'Edit Nation Assessment' : 'Nation Assessment'}
              </h2>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-100">Step {currentStep} of {totalSteps}</span>
                <span className="text-sm text-blue-100">{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full bg-blue-800 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="bg-gray-50 px-8 py-6 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              <span>{currentStep === totalSteps ? (initialData ? 'Update Analysis' : 'Generate Analysis') : 'Next'}</span>
              {currentStep === totalSteps ? (
                <Check className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}