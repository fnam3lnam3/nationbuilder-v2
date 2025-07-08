import React from 'react';
import { Globe, Calendar, Trash2, Edit, Eye } from 'lucide-react';
import { SavedNation } from '../types';

interface SavedNationsProps {
  nations: SavedNation[];
  onLoad: (nation: SavedNation) => void;
  onDelete: (nationId: string) => void;
  onEdit: (nation: SavedNation) => void;
}

export default function SavedNations({ nations, onLoad, onDelete, onEdit }: SavedNationsProps) {
  if (nations.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Nations</h3>
        <p className="text-gray-600">Create your first nation to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Your Saved Nations ({nations.length}/5)</h3>
      <div className="grid gap-4">
        {nations.map((nation) => (
          <div key={nation.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">{nation.name}</h4>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Population: {nation.assessmentData.population.toLocaleString()}</p>
                  <p>Location: {nation.assessmentData.location}</p>
                  <p>Political: {nation.assessmentData.politicalStructure}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {new Date(nation.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onLoad(nation)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Analysis"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit(nation)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit Nation"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(nation.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Nation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}