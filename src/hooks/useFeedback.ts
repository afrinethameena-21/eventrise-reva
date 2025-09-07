import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface FeedbackData {
  rating: number;
  comment?: string;
}

export const useFeedback = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const submitFeedback = async (eventId: string, feedbackData: FeedbackData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit feedback.",
        variant: "destructive",
      });
      return { error: 'Not authenticated' };
    }

    setLoading(true);
    try {
      // Check if student has attended the event
      const { data: attendance, error: attError } = await supabase
        .from('attendance')
        .select('id')
        .eq('student_id', user.id)
        .eq('event_id', eventId)
        .single();

      if (attError || !attendance) {
        toast({
          title: "Attendance required",
          description: "You must attend the event to submit feedback.",
          variant: "destructive",
        });
        return { error: 'Not attended' };
      }

      const { data, error } = await supabase
        .from('feedback')
        .insert([
          {
            student_id: user.id,
            event_id: eventId,
            rating: feedbackData.rating,
            comment: feedbackData.comment,
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Feedback already submitted",
            description: "You have already submitted feedback for this event.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Feedback submitted",
          description: "Thank you for your feedback!",
        });
      }

      return { data, error };
    } catch (error: any) {
      toast({
        title: "Error submitting feedback",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const getEventFeedback = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          id,
          rating,
          comment,
          submitted_at,
          profiles!student_id (
            id,
            name,
            email
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error: any) {
      return { data: [], error };
    }
  };

  const getUserFeedback = async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return { data: [], error: 'No user ID' };

    try {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          id,
          rating,
          comment,
          submitted_at,
          events (
            id,
            title,
            type,
            date
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
    submitFeedback,
    getEventFeedback,
    getUserFeedback,
  };
};