import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Query {
  id: string;
  title: string;
  content: string;
  event_id?: string;
  asked_by: string;
  created_at: string;
  profiles: {
    name: string;
    role: 'admin' | 'student';
  };
  events?: {
    title: string;
  };
  responses?: QueryResponse[];
}

export interface QueryResponse {
  id: string;
  content: string;
  query_id: string;
  responded_by: string;
  created_at: string;
  profiles: {
    name: string;
    role: 'admin' | 'student';
  };
}

export const useQueries = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchQueries = async () => {
    try {
      // Temporarily disabled until types are updated
      setQueries([]);
    } catch (error: any) {
      toast({
        title: "Error fetching queries",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const createQuery = async (queryData: {
    title: string;
    content: string;
    event_id?: string;
  }) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to ask a question.",
        variant: "destructive",
      });
      return { error: 'Not authenticated' };
    }

    try {
      // Temporarily disabled until types are updated
      toast({
        title: "Feature coming soon",
        description: "Query system will be available once database types are updated.",
      });
      return { data: null, error: null };
    } catch (error: any) {
      toast({
        title: "Error posting question",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const respondToQuery = async (queryId: string, content: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to respond.",
        variant: "destructive",
      });
      return { error: 'Not authenticated' };
    }

    try {
      // Temporarily disabled until types are updated
      toast({
        title: "Feature coming soon",
        description: "Response system will be available once database types are updated.",
      });
      return { data: null, error: null };
    } catch (error: any) {
      toast({
        title: "Error posting response",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  return {
    queries,
    loading,
    fetchQueries,
    createQuery,
    respondToQuery,
  };
};