import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SavedNation, AssessmentData, User } from '../types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface SavedNationsManager {
  savedNations: SavedNation[];
  loading: boolean;
  saveNation: (name: string, assessmentData: AssessmentData, customPolicies?: any) => Promise<string>;
  updateNation: (id: string, name: string, assessmentData: AssessmentData, customPolicies?: any) => Promise<boolean>;
  deleteNation: (id: string) => Promise<boolean>;
  refreshNations: () => Promise<void>;
  getMaxNations: () => number;
  makeNationPublic: (id: string) => Promise<string | null>;
  makeNationPrivate: (id: string) => Promise<boolean>;
}

export function useSavedNations(user: User | null, subscription: any): SavedNationsManager {
  const [savedNations, setSavedNations] = useState<SavedNation[]>([]);
  const [loading, setLoading] = useState(false);

  const getMaxNations = () => {
    return subscription?.subscription_status === 'active' ? 30 : 5;
  };

  const refreshNations = async () => {
    if (!user) {
      setSavedNations([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_nations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_temporary', false)
        .is('deleted_at', null)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const nations: SavedNation[] = (data || []).map(nation => ({
        id: nation.id,
        name: nation.name,
        assessmentData: nation.assessment_data,
        customPolicies: nation.custom_policies || {},
        createdAt: new Date(nation.created_at),
        lastModified: new Date(nation.updated_at)
      }));

      setSavedNations(nations);
    } catch (error) {
      console.error('Error fetching saved nations:', error);
      setSavedNations([]);
    } finally {
      setLoading(false);
    }
  };

  const saveNation = async (
    name: string, 
    assessmentData: AssessmentData, 
    customPolicies: any = {}
  ): Promise<string> => {
    if (!user) throw new Error('User must be logged in to save nations');

    const maxNations = getMaxNations();
    if (savedNations.length >= maxNations) {
      throw new Error(`You can only save up to ${maxNations} nations. Please delete one to save a new nation.`);
    }

    try {
      const { data, error } = await supabase
        .from('saved_nations')
        .insert({
          name,
          user_id: user.id,
          assessment_data: assessmentData,
          custom_policies: customPolicies,
          is_temporary: false
        })
        .select()
        .single();

      if (error) throw error;

      await refreshNations();
      return data.id;
    } catch (error) {
      console.error('Error saving nation:', error);
      throw error;
    }
  };

  const updateNation = async (
    id: string,
    name: string, 
    assessmentData: AssessmentData, 
    customPolicies: any = {}
  ): Promise<boolean> => {
    if (!user) throw new Error('User must be logged in to update nations');

    try {
      const { error } = await supabase
        .from('saved_nations')
        .update({
          name,
          assessment_data: assessmentData,
          custom_policies: customPolicies,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshNations();
      return true;
    } catch (error) {
      console.error('Error updating nation:', error);
      return false;
    }
  };

  const deleteNation = async (id: string): Promise<boolean> => {
    if (!user) throw new Error('User must be logged in to delete nations');

    try {
      const { error } = await supabase
        .from('saved_nations')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshNations();
      return true;
    } catch (error) {
      console.error('Error deleting nation:', error);
      return false;
    }
  };

  const makeNationPublic = async (id: string): Promise<string | null> => {
    if (!user) throw new Error('User must be logged in to make nations public');

    try {
      const { data, error } = await supabase.rpc('make_nation_public', {
        nation_id: id,
        user_id: user.id
      });

      if (error) throw error;
      
      await refreshNations();
      return data; // Returns share token
    } catch (error) {
      console.error('Error making nation public:', error);
      return null;
    }
  };

  const makeNationPrivate = async (id: string): Promise<boolean> => {
    if (!user) throw new Error('User must be logged in to make nations private');

    try {
      const { data, error } = await supabase.rpc('make_nation_private', {
        nation_id: id,
        user_id: user.id
      });

      if (error) throw error;
      
      await refreshNations();
      return data;
    } catch (error) {
      console.error('Error making nation private:', error);
      return false;
    }
  };

  useEffect(() => {
    refreshNations();
  }, [user]);

  return {
    savedNations,
    loading,
    saveNation,
    updateNation,
    deleteNation,
    refreshNations,
    getMaxNations,
    makeNationPublic,
    makeNationPrivate
  };
}