import { useState } from "react";
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
  Heart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockEvents = [
  {
    id: 1,
    title: "Tech Symposium 2024",
    description: "Explore the latest trends in technology and innovation",
    type: "Workshop",
    date: "2024-01-15",
    time: "10:00 AM",
    location: "Main Auditorium",
    maxParticipants: 150,
    registered: 145,
    isRegistered: false,
    rating: 4.2
  },
  {
    id: 2,
    title: "Annual Cultural Fest",
    description: "Celebrate diversity through music, dance, and art",
    type: "Festival",
    date: "2024-01-20",
    time: "6:00 PM",
    location: "Campus Grounds",
    maxParticipants: 500,
    registered: 320,
    isRegistered: true,
    rating: 4.8
  },
  {
    id: 3,
    title: "Career Fair Spring",
    description: "Meet industry professionals and explore career opportunities",
    type: "Seminar",
    date: "2024-01-25",
    time: "9:00 AM",
    location: "Conference Hall",
    maxParticipants: 200,
    registered: 89,
    isRegistered: false,
    rating: 4.1
  },
  {
    id: 4,
    title: "AI Workshop Series",
    description: "Hands-on experience with machine learning and AI tools",
    type: "Workshop",
    date: "2024-01-30",
    time: "2:00 PM",
    location: "Computer Lab",
    maxParticipants: 50,
    registered: 45,
    isRegistered: true,
    rating: 4.5
  }
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState(mockEvents);

  const handleRegister = (eventId: number) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isRegistered: true, registered: event.registered + 1 }
        : event
    ));
    
    const event = events.find(e => e.id === eventId);
    toast({
      title: "Registration Successful!",
      description: `You've registered for "${event?.title}". Check your email for details.`,
    });
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const registeredEvents = events.filter(event => event.isRegistered);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-accent px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Student Portal</h1>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {registeredEvents.length} Events Registered
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Events</TabsTrigger>
            <TabsTrigger value="my-events">My Events</TabsTrigger>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="shadow-soft hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{event.type}</Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Star className="h-3 w-3 mr-1 text-warning" />
                            {event.rating}
                          </div>
                        </div>
                      </div>
                      {event.isRegistered && (
                        <Badge className="bg-success text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Registered
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {event.registered}/{event.maxParticipants} registered
                      </div>
                    </div>

                    {/* Registration Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Registration Progress</span>
                        <span>{Math.round((event.registered / event.maxParticipants) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-accent h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(event.registered / event.maxParticipants) * 100}%` }}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => handleRegister(event.id)}
                      disabled={event.isRegistered || event.registered >= event.maxParticipants}
                      className="w-full"
                      variant={event.isRegistered ? "outline" : "default"}
                    >
                      {event.isRegistered ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Registered
                        </>
                      ) : event.registered >= event.maxParticipants ? (
                        "Event Full"
                      ) : (
                        <>
                          <Heart className="h-4 w-4 mr-2" />
                          Register Now
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Registered Events</h2>
              <Badge variant="outline">{registeredEvents.length} events</Badge>
            </div>

            {registeredEvents.length === 0 ? (
              <Card className="shadow-soft">
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Events Registered</h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring events and register for the ones that interest you!
                  </p>
                  <Button onClick={() => navigate("/student")}>
                    Browse Events
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {registeredEvents.map((event) => (
                  <Card key={event.id} className="shadow-soft hover:shadow-medium transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            {event.title}
                            <Badge className="ml-2 bg-success text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Registered
                            </Badge>
                          </CardTitle>
                          <CardDescription className="mt-2">{event.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-2 text-warning" />
                          Rating: {event.rating}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;