import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface SessionManager {
  sessionId: string;
  createTemporaryNation: (name: string, assessmentData: any, customPolicies?: any) => Promise<string>;
  linkToUser: (userId: string) => Promise<boolean>;
  getTemporaryNations: () => Promise<any[]>;
  deleteTemporaryNation: (nationId: string) => Promise<boolean>;
}

export function useSessionManager(): SessionManager {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Get or create session ID
    let storedSessionId = localStorage.getItem('assessment_session_id');
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('assessment_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  const createTemporaryNation = async (
    name: string, 
    assessmentData: any, 
    customPolicies: any = {}
  ): Promise<string> => {
    try {
      const { data, error } = await supabase.rpc('create_temporary_nation', {
        p_session_id: sessionId,
        p_name: name,
        p_assessment_data: assessmentData,
        p_custom_policies: customPolicies
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating temporary nation:', error);
      throw error;
    }
  };

  const linkToUser = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('link_temporary_nation_to_user', {
        p_session_id: sessionId,
        p_user_id: userId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error linking temporary nation to user:', error);
      return false;
    }
  };

  const getTemporaryNations = async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('saved_nations')
        .select('*')
        .eq('session_id', sessionId)
        .eq('is_temporary', true)
        .is('deleted_at', null)
        .gt('expires_at', new Date().toISOString());

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching temporary nations:', error);
      return [];
    }
  };

  const deleteTemporaryNation = async (nationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('saved_nations')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', nationId)
        .eq('session_id', sessionId)
        .eq('is_temporary', true);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting temporary nation:', error);
      return false;
    }
  };

  return {
    sessionId,
    createTemporaryNation,
    linkToUser,
    getTemporaryNations,
    deleteTemporaryNation
  };
}