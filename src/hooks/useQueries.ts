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
      const { data, error } = await supabase
        .from('queries')
        .select(`
          id,
          title,
          content,
          event_id,
          asked_by,
          created_at,
          profiles!asked_by (
            name,
            role
          ),
          events (
            title
          ),
          query_responses (
            id,
            content,
            responded_by,
            created_at,
            profiles!responded_by (
              name,
              role
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQueries(data || []);
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
      const { data, error } = await supabase
        .from('queries')
        .insert([{
          ...queryData,
          asked_by: user.id,
        }])
        .select(`
          id,
          title,
          content,
          event_id,
          asked_by,
          created_at,
          profiles!asked_by (
            name,
            role
          ),
          events (
            title
          )
        `)
        .single();

      if (error) throw error;

      setQueries(prev => [data, ...prev]);
      toast({
        title: "Question posted",
        description: "Your question has been posted successfully.",
      });

      return { data, error: null };
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
      const { data, error } = await supabase
        .from('query_responses')
        .insert([{
          query_id: queryId,
          content,
          responded_by: user.id,
        }])
        .select(`
          id,
          content,
          query_id,
          responded_by,
          created_at,
          profiles!responded_by (
            name,
            role
          )
        `)
        .single();

      if (error) throw error;

      // Update the queries state to include the new response
      setQueries(prev => prev.map(query => {
        if (query.id === queryId) {
          return {
            ...query,
            responses: [...(query.responses || []), data]
          };
        }
        return query;
      }));

      toast({
        title: "Response posted",
        description: "Your response has been posted successfully.",
      });

      return { data, error: null };
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