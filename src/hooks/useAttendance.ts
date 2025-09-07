import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useAttendance = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const markAttendance = async (studentId: string, eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to mark attendance.",
        variant: "destructive",
      });
      return { error: 'Not authenticated' };
    }

    setLoading(true);
    try {
      // Check if student is registered for the event
      const { data: registration, error: regError } = await supabase
        .from('registrations')
        .select('id')
        .eq('student_id', studentId)
        .eq('event_id', eventId)
        .single();

      if (regError || !registration) {
        toast({
          title: "Registration not found",
          description: "Student must be registered for this event to mark attendance.",
          variant: "destructive",
        });
        return { error: 'Not registered' };
      }

      const { data, error } = await supabase
        .from('attendance')
        .insert([
          {
            student_id: studentId,
            event_id: eventId,
            marked_by: user.id,
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already marked",
            description: "Attendance has already been marked for this student.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Attendance marked",
          description: "Student attendance has been recorded successfully.",
        });
      }

      return { data, error };
    } catch (error: any) {
      toast({
        title: "Error marking attendance",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const getEventAttendance = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          id,
          marked_at,
          profiles!student_id (
            id,
            name,
            email,
            srn,
            college_name
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error: any) {
      return { data: [], error };
    }
  };

  const getUserAttendance = async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return { data: [], error: 'No user ID' };

    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          id,
          marked_at,
          events (
            id,
            title,
            description,
            type,
            date,
            location
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
    markAttendance,
    getEventAttendance,
    getUserAttendance,
  };
};