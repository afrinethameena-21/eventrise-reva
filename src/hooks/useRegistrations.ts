import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useRegistrations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const registerForEvent = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register for events.",
        variant: "destructive",
      });
      return { error: 'Not authenticated' };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert([
          {
            student_id: user.id,
            event_id: eventId,
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already registered",
            description: "You are already registered for this event.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Registration successful",
          description: "You have been registered for the event.",
        });
      }

      return { data, error };
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const getEventRegistrations = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          id,
          registered_at,
          profiles!student_id (
            id,
            name,
            email,
            srn,
            college_name,
            qr_code
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error: any) {
      return { data: [], error };
    }
  };

  const getUserRegistrations = async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return { data: [], error: 'No user ID' };

    try {
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          id,
          registered_at,
          events (
            id,
            title,
            description,
            type,
            date,
            location,
            status
          )
        `)
        .eq('student_id', targetUserId);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error: any) {
      return { data: [], error };
    }
  };

  return {
    loading,
    registerForEvent,
    getEventRegistrations,
    getUserRegistrations,
  };
};