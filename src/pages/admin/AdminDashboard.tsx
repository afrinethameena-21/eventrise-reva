import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Plus, 
  Eye,
  BarChart3,
  Star,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const mockEvents = [
  {
    id: 1,
    title: "Tech Symposium 2024",
    type: "Workshop",
    date: "2024-01-15",
    registrations: 145,
    attendance: 78,
    avgRating: 4.2
  },
  {
    id: 2,
    title: "Annual Cultural Fest",
    type: "Festival",
    date: "2024-01-20",
    registrations: 320,
    attendance: 85,
    avgRating: 4.8
  },
  {
    id: 3,
    title: "Career Fair Spring",
    type: "Seminar",
    date: "2024-01-25",
    registrations: 89,
    attendance: 92,
    avgRating: 4.1
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary px-6 py-4">
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
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <Button 
            onClick={() => navigate("/admin/create-event")}
            className="bg-white text-primary hover:bg-white/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-card shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+3 from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                  <Users className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,254</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
                  <TrendingUp className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                  <Star className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.3</div>
                  <p className="text-xs text-muted-foreground">+0.2 from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Events */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>Latest events and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{event.type}</Badge>
                          <span className="text-sm text-muted-foreground">{event.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{event.registrations}</div>
                          <div className="text-muted-foreground">Registered</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{event.attendance}%</div>
                          <div className="text-muted-foreground">Attended</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{event.avgRating}</div>
                          <div className="text-muted-foreground">Rating</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Events</h2>
              <Button onClick={() => navigate("/admin/create-event")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>

            <div className="grid gap-6">
              {mockEvents.map((event) => (
                <Card key={event.id} className="shadow-soft hover:shadow-medium transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{event.type}</Badge>
                          <span>{event.date}</span>
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">{event.registrations}</div>
                        <div className="text-sm text-muted-foreground">Registrations</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">{event.attendance}%</div>
                        <div className="text-sm text-muted-foreground">Attendance</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-warning">{event.avgRating}</div>
                        <div className="text-sm text-muted-foreground">Avg Rating</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics & Reports</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Event Popularity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockEvents.map((event, index) => (
                      <div key={event.id} className="flex items-center justify-between">
                        <span className="text-sm">{event.title}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className="bg-gradient-primary h-2 rounded-full" 
                              style={{ width: `${(event.registrations / 320) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{event.registrations}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Attendance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between">
                        <span className="text-sm">{event.title}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className="bg-gradient-accent h-2 rounded-full" 
                              style={{ width: `${event.attendance}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{event.attendance}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;