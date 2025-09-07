import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Search, 
  MapPin, 
  Clock, 
  Users,
  Star,
  ArrowLeft,
  CheckCircle,
  Heart,
  QrCode,
  MessageSquare,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEvents } from "@/hooks/useEvents";
import { useRegistrations } from "@/hooks/useRegistrations";
import { useAttendance } from "@/hooks/useAttendance";
import { useFeedback } from "@/hooks/useFeedback";
import { useAuth } from "@/contexts/AuthContext";
import UserProfile from "@/components/UserProfile";
import StudentProfile from "@/components/StudentProfile";
import QuerySystem from "@/components/QuerySystem";
import FeedbackModal from "@/components/FeedbackModal";
import { format, isAfter, isBefore } from "date-fns";


const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    eventId: string;
    eventTitle: string;
  }>({ isOpen: false, eventId: '', eventTitle: '' });
  
  const { events, loading: eventsLoading } = useEvents();
  const { registerForEvent, getUserRegistrations, loading: regLoading } = useRegistrations();
  const { getUserAttendance } = useAttendance();
  const { getUserFeedback } = useFeedback();
  
  const [userRegistrations, setUserRegistrations] = useState<any[]>([]);
  const [userAttendance, setUserAttendance] = useState<any[]>([]);
  const [userFeedback, setUserFeedback] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!profile) return;
      
      const [regData, attData, feedData] = await Promise.all([
        getUserRegistrations(),
        getUserAttendance(),
        getUserFeedback()
      ]);
      
      setUserRegistrations(regData.data || []);
      setUserAttendance(attData.data || []);
      setUserFeedback(feedData.data || []);
    };
    
    fetchUserData();
  }, [profile]);

  const handleRegister = async (eventId: string) => {
    const { error } = await registerForEvent(eventId);
    if (!error) {
      // Refresh user registrations
      const { data } = await getUserRegistrations();
      setUserRegistrations(data || []);
    }
  };

  const isRegistered = (eventId: string) => {
    return userRegistrations.some(reg => reg.events?.id === eventId);
  };

  const hasAttended = (eventId: string) => {
    return userAttendance.some(att => att.events?.id === eventId);
  };

  const hasFeedback = (eventId: string) => {
    return userFeedback.some(feed => feed.events?.id === eventId);
  };

  const getCurrentDate = () => new Date();

  // Filter events: future events or past events that haven't been given feedback yet
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Show future events or past events that user attended but hasn't given feedback
    const isFutureEvent = isAfter(eventDate, getCurrentDate());
    const isPastEventNeedingFeedback = isBefore(eventDate, getCurrentDate()) && 
                                       hasAttended(event.id) && 
                                       !hasFeedback(event.id);
    
    return matchesSearch && (isFutureEvent || isPastEventNeedingFeedback);
  });

  const registeredEvents = userRegistrations.map(reg => reg.events).filter(Boolean);

  if (eventsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-First Header */}
      <div className="bg-gradient-accent px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg sm:text-2xl font-bold text-white">Student Portal</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white text-xs sm:text-sm">
              {registeredEvents.length} Events
            </Badge>
            <UserProfile />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="browse" className="text-xs sm:text-sm">Events</TabsTrigger>
            <TabsTrigger value="my-events" className="text-xs sm:text-sm">My Events</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">
              <QrCode className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="queries" className="text-xs sm:text-sm">
              <MessageSquare className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Q&A</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events by title or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {filteredEvents.map((event) => {
                const eventDate = new Date(event.date);
                const isPastEvent = isBefore(eventDate, getCurrentDate());
                const needsFeedback = isPastEvent && hasAttended(event.id) && !hasFeedback(event.id);
                
                return (
                  <Card key={event.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <CardTitle className="text-base sm:text-lg">{event.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">{event.type}</Badge>
                            {needsFeedback && (
                              <Badge variant="destructive" className="text-xs">
                                Feedback Required
                              </Badge>
                            )}
                          </div>
                        </div>
                        {isRegistered(event.id) && (
                          <Badge className="bg-success text-white text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Registered
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(new Date(event.date), 'PPP')}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          {event.max_capacity} max capacity
                        </div>
                        {hasAttended(event.id) && (
                          <div className="flex items-center text-sm text-success">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Attended
                          </div>
                        )}
                      </div>

                      {needsFeedback ? (
                        <Button
                          onClick={() => setFeedbackModal({
                            isOpen: true,
                            eventId: event.id,
                            eventTitle: event.title
                          })}
                          className="w-full"
                          variant="destructive"
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Provide Feedback
                        </Button>
                      ) : !isPastEvent ? (
                        <Button
                          onClick={() => handleRegister(event.id)}
                          disabled={isRegistered(event.id) || regLoading}
                          className="w-full"
                          variant={isRegistered(event.id) ? "outline" : "default"}
                        >
                          {isRegistered(event.id) ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Registered
                            </>
                          ) : (
                            <>
                              <Heart className="h-4 w-4 mr-2" />
                              Register Now
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button disabled className="w-full" variant="outline">
                          Event Completed
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="my-events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold">My Registered Events</h2>
              <Badge variant="outline" className="text-xs sm:text-sm">{registeredEvents.length} events</Badge>
            </div>

            {registeredEvents.length === 0 ? (
              <Card className="shadow-soft">
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Events Registered</h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring events and register for the ones that interest you!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:gap-6">
                {registeredEvents.map((event) => (
                  <Card key={event.id} className="shadow-soft hover:shadow-medium transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center text-base sm:text-lg">
                            {event.title}
                            <Badge className="ml-2 bg-success text-white text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Registered
                            </Badge>
                          </CardTitle>
                          <CardDescription className="mt-2 text-sm">{event.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-xs">{event.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {format(new Date(event.date), 'PPP')}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          Max: {event.max_capacity}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <StudentProfile />
          </TabsContent>

          <TabsContent value="queries" className="space-y-6">
            <QuerySystem />
          </TabsContent>
        </Tabs>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal({ isOpen: false, eventId: '', eventTitle: '' })}
        eventId={feedbackModal.eventId}
        eventTitle={feedbackModal.eventTitle}
      />
    </div>
  );
};

export default StudentDashboard;