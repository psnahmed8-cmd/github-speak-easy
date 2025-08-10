import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AnalysisProject {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  data_file_url?: string;
  analysis_results?: any;
  created_at: string;
  updated_at: string;
}

export function useAnalysisProjects() {
  const [projects, setProjects] = useState<AnalysisProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const fetchProjects = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('analysis_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects((data as AnalysisProject[]) || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (title: string, description?: string) => {
    if (!session?.user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('analysis_projects')
        .insert({
          user_id: session.user.id,
          title,
          description,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchProjects(); // Refresh the list
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<AnalysisProject>) => {
    try {
      const { data, error } = await supabase
        .from('analysis_projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchProjects(); // Refresh the list
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('analysis_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchProjects(); // Refresh the list
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [session?.user?.id]);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  };
}