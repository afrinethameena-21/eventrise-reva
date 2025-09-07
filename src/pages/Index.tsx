import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, BarChart3, Star, ArrowRight, BookOpen, Shield, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-primary px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">EventRise Campus</h1>
          {user && (
            <Button
              variant="ghost"
              onClick={() => navigate(profile?.role === 'admin' ? '/admin' : '/student')}
              className="text-white hover:bg-white/20"
            >
              Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-primary">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-6">
              Campus Event Management
              <span className="block text-accent-light">Made Simple</span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Streamline event creation, registration, and attendance tracking for your educational institution.
            </p>
            {user ? (
              <Button 
                size="lg" 
                onClick={() => navigate(profile?.role === 'admin' ? '/admin' : '/student')}
                className="group bg-white text-primary hover:bg-white/90"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/auth")}
                  className="group bg-white text-primary hover:bg-white/90"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/role-selection")}
                  className="group text-white border-white hover:bg-white hover:text-primary"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features for Campus Events</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage events effectively, from creation to feedback collection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <Calendar className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Event Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create and manage events with detailed information, dates, and capacity limits.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-accent mb-4" />
              <CardTitle>Student Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Easy registration process with duplicate prevention and real-time updates.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <BarChart3 className="h-12 w-12 mx-auto text-success mb-4" />
              <CardTitle>Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive reports on attendance, registration rates, and event popularity.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <Star className="h-12 w-12 mx-auto text-warning mb-4" />
              <CardTitle>Feedback System</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Collect and analyze student feedback with rating systems and comments.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-elegant hover:shadow-large transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">For Administrators</CardTitle>
              <CardDescription className="text-lg">
                Complete control over event management and reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-primary mr-2" />
                  Create and manage events
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-primary mr-2" />
                  Track attendance with QR scanning
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-primary mr-2" />
                  Generate detailed reports
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-primary mr-2" />
                  Monitor student engagement
                </li>
              </ul>
              <Button 
                onClick={() => navigate("/role-selection")} 
                className="w-full"
              >
                Start as Admin
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-elegant hover:shadow-large transition-shadow">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-accent mb-4" />
              <CardTitle className="text-2xl">For Students</CardTitle>
              <CardDescription className="text-lg">
                Discover and participate in campus events seamlessly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-accent mr-2" />
                  Browse upcoming events
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-accent mr-2" />
                  Register with one click
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-accent mr-2" />
                  QR code for attendance
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-accent mr-2" />
                  Submit event feedback
                </li>
              </ul>
              <Button 
                onClick={() => navigate("/role-selection")} 
                variant="secondary" 
                className="w-full"
              >
                Start as Student
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
