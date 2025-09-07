-- Create queries table
CREATE TABLE public.queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  event_id UUID REFERENCES public.events(id),
  asked_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create query_responses table
CREATE TABLE public.query_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query_id UUID NOT NULL REFERENCES public.queries(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  responded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.query_responses ENABLE ROW LEVEL SECURITY;

-- RLS policies for queries table
CREATE POLICY "Users can view all queries" 
ON public.queries 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create queries" 
ON public.queries 
FOR INSERT 
WITH CHECK (auth.uid() = asked_by);

CREATE POLICY "Users can update their own queries" 
ON public.queries 
FOR UPDATE 
USING (auth.uid() = asked_by);

-- RLS policies for query_responses table
CREATE POLICY "Users can view all query responses" 
ON public.query_responses 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create responses" 
ON public.query_responses 
FOR INSERT 
WITH CHECK (auth.uid() = responded_by);

-- Add updated_at trigger for queries
CREATE TRIGGER update_queries_updated_at
BEFORE UPDATE ON public.queries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();