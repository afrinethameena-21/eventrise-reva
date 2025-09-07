import React, { useState } from 'react';
import { useQueries } from '@/hooks/useQueries';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageSquare, Plus, Send, Users, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const QuerySystem = () => {
  const { queries, loading, createQuery, respondToQuery } = useQueries();
  const { events } = useEvents();
  const { profile } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newQuery, setNewQuery] = useState({
    title: '',
    content: '',
    event_id: '',
  });
  
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuery.title.trim() || !newQuery.content.trim()) return;

    const { error } = await createQuery({
      title: newQuery.title,
      content: newQuery.content,
      event_id: newQuery.event_id || undefined,
    });

    if (!error) {
      setNewQuery({ title: '', content: '', event_id: '' });
      setIsDialogOpen(false);
    }
  };

  const handleSubmitResponse = async (queryId: string) => {
    const content = responses[queryId]?.trim();
    if (!content) return;

    const { error } = await respondToQuery(queryId, content);
    if (!error) {
      setResponses(prev => ({ ...prev, [queryId]: '' }));
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Community Q&A</h2>
          <Badge variant="outline" className="ml-2">
            {queries.length} questions
          </Badge>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ask Question
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Ask a Question</DialogTitle>
              <DialogDescription>
                Get help from the community about events and activities.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitQuery} className="space-y-4">
              <div>
                <Input
                  placeholder="Question title..."
                  value={newQuery.title}
                  onChange={(e) => setNewQuery(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Select
                  value={newQuery.event_id}
                  onValueChange={(value) => setNewQuery(prev => ({ ...prev, event_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Related to specific event (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">General Question</SelectItem>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Textarea
                  placeholder="Describe your question in detail..."
                  value={newQuery.content}
                  onChange={(e) => setNewQuery(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Post Question</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {queries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Questions Yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to ask a question and start the conversation!
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Ask First Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          queries.map((query) => (
            <Card key={query.id} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{query.title}</CardTitle>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {getInitials(query.profiles.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{query.profiles.name}</span>
                        <Badge variant={query.profiles.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                          {query.profiles.role === 'admin' ? 'Staff' : 'Student'}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(query.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    {query.events && (
                      <div className="flex items-center space-x-1 text-sm text-primary">
                        <Calendar className="h-3 w-3" />
                        <span>Related to: {query.events.title}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{query.responses?.length || 0}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">{query.content}</p>
                
                {/* Responses */}
                {query.responses && query.responses.length > 0 && (
                  <div className="space-y-3 pl-4 border-l-2 border-muted">
                    {query.responses.map((response) => (
                      <div key={response.id} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs bg-accent text-accent-foreground">
                              {getInitials(response.profiles.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{response.profiles.name}</span>
                          <Badge variant={response.profiles.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                            {response.profiles.role === 'admin' ? 'Staff' : 'Student'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(response.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-7">{response.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Response Input */}
                {profile && (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Write a response..."
                      value={responses[query.id] || ''}
                      onChange={(e) => setResponses(prev => ({ ...prev, [query.id]: e.target.value }))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmitResponse(query.id);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleSubmitResponse(query.id)}
                      disabled={!responses[query.id]?.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default QuerySystem;