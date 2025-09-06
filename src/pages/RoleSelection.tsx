import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Settings, Users, Calendar } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <div className="max-w-4xl w-full animate-fade-in">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="h-16 w-16 text-white mr-4" />
            <h1 className="text-5xl font-bold text-white">CampusConnect</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Your comprehensive platform for managing campus events, workshops, and academic activities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-card/95 backdrop-blur-sm border-white/20 shadow-strong hover:shadow-stronger transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-gradient-primary rounded-full w-fit">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription className="text-base">
                Manage events, view analytics, and oversee campus activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Create and manage events
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  View registration reports
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Settings className="h-4 w-4 mr-2" />
                  Track attendance and feedback
                </div>
              </div>
              <Button 
                onClick={() => navigate("/admin")}
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                size="lg"
              >
                Access Admin Portal
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/95 backdrop-blur-sm border-white/20 shadow-strong hover:shadow-stronger transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-gradient-accent rounded-full w-fit">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Student Portal</CardTitle>
              <CardDescription className="text-base">
                Discover events, register, and engage with campus life
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Browse upcoming events
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  Register and attend events
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Settings className="h-4 w-4 mr-2" />
                  Track your participation
                </div>
              </div>
              <Button 
                onClick={() => navigate("/student")}
                className="w-full bg-gradient-accent hover:opacity-90 transition-opacity"
                size="lg"
              >
                Access Student Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;