import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'student';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (requiredRole && profile?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        if (profile?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      }
    }
  }, [user, profile, loading, navigate, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || (requiredRole && profile?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;