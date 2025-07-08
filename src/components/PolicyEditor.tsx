import React, { useState } from 'react';
import { Edit3, Save, X, FileText, DollarSign, Scale, Leaf } from 'lucide-react';

interface PolicyEditorProps {
  onSave: (policies: Record<string, string>) => void;
  onClose: () => void;
  currentPolicies?: Record<string, string>;
}

export default function PolicyEditor({ onSave, onClose, currentPolicies = {} }: PolicyEditorProps) {
  const [policies, setPolicies] = useState({
    ethical: currentPolicies.ethical || '',
    economic: currentPolicies.economic || '',
    judicial: currentPolicies.judicial || '',
    environmental: currentPolicies.environmental || ''
  });

  const handleSave = () => {
    onSave(policies);
  };

  const policyTypes = [
    {
      key: 'ethical',
      title: 'Ethical Policies',
      icon: FileText,
      placeholder: 'Define ethical guidelines, moral frameworks, and value systems for your nation...',
      description: 'Core values, moral principles, and ethical standards'
    },
    {
      key: 'economic',
      title: 'Economic Policies',
      icon: DollarSign,
      placeholder: 'Specify economic regulations, trade policies, taxation, and financial systems...',
      description: 'Economic regulations, trade, taxation, and financial frameworks'
    },
    {
      key: 'judicial',
      title: 'Judicial Policies',
      icon: Scale,
      placeholder: 'Outline legal procedures, court systems, and justice mechanisms...',
      description: 'Legal procedures, court systems, and justice administration'
    },
    {
      key: 'environmental',
      title: 'Environmental Policies',
      icon: Leaf,
      placeholder: 'Detail environmental protection, sustainability measures, and resource management...',
      description: 'Environmental protection, sustainability, and resource stewardship'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Edit3 className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Customize Nation Policies</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {policyTypes.map(({ key, title, icon: Icon, placeholder, description }) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                </div>
                <textarea
                  value={policies[key as keyof typeof policies]}
                  onChange={(e) => setPolicies(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <p className="text-sm text-gray-600">
            These custom policies will be integrated into your nation's analysis and constitution.
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}