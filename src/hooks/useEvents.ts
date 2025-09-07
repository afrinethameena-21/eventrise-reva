import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'hackathon' | 'workshop' | 'fest' | 'seminar' | 'conference' | 'competition';
  date: string;
  location: string;
  max_capacity: number;
  status: 'active' | 'cancelled' | 'completed';
  created_by: string;
  created_at: string;
  updated_at: string;
  registrations?: any[];
  _count?: {
    registrations: number;
    attendance: number;
    feedback: number;
  };
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching events",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          created_by: '', // This will be set by RLS policy
        }])
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => [...prev, data]);
      toast({
        title: "Event created",
        description: "The event has been created successfully.",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error creating event",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => prev.map(event => event.id === id ? data : event));
      toast({
        title: "Event updated",
        description: "The event has been updated successfully.",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error updating event",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const cancelEvent = async (id: string) => {
    return updateEvent(id, { status: 'cancelled' });
  };

  return {
    events,
    loading,
    fetchEvents,
    createEvent,
    updateEvent,
    cancelEvent,
  };
};