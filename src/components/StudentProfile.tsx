import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, QrCode, Edit, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { generateQRCode } from '@/utils/qrCode';

const StudentProfile = () => {
  const { profile, updateProfile } = useAuth();
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    srn: '',
    college_name: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        srn: profile.srn || '',
        college_name: profile.college_name || '',
      });

      // Generate QR code if profile has qr_code data
      if (profile.qr_code) {
        generateQRCode(profile.qr_code).then(setQrCodeData);
      }
    }
  }, [profile]);

  const handleSave = async () => {
    const { error } = await updateProfile(formData);
    if (!error) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        srn: profile.srn || '',
        college_name: profile.college_name || '',
      });
    }
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading profile...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </div>
            {!isEditing ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </CardTitle>
          <CardDescription>
            Your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            ) : (
              <p className="text-sm">{profile.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <Badge variant="secondary">Cannot be changed</Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            {isEditing ? (
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            ) : (
              <p className="text-sm">{profile.phone || 'Not provided'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="srn">Student Registration Number (SRN)</Label>
            {isEditing ? (
              <Input
                id="srn"
                value={formData.srn}
                onChange={(e) => setFormData({ ...formData, srn: e.target.value })}
                placeholder="Enter your SRN"
              />
            ) : (
              <p className="text-sm">{profile.srn || 'Not provided'}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="college">College Name</Label>
            {isEditing ? (
              <Input
                id="college"
                value={formData.college_name}
                onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                placeholder="Enter your college name"
              />
            ) : (
              <p className="text-sm">{profile.college_name || 'Not provided'}</p>
            )}
          </div>

          <div className="pt-4">
            <Badge variant="outline">
              Role: {profile.role}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* QR Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="h-5 w-5 mr-2" />
            Your QR Code
          </CardTitle>
          <CardDescription>
            Show this QR code to event organizers for attendance marking
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {qrCodeData ? (
            <div className="space-y-4">
              <div className="inline-block p-4 bg-white rounded-lg shadow-soft">
                <img 
                  src={qrCodeData} 
                  alt="Student QR Code" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">QR Code ID:</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {profile.qr_code}
                </code>
              </div>
              <p className="text-sm text-muted-foreground">
                Present this QR code at events for quick attendance marking
              </p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">QR Code not available</p>
              <p className="text-sm text-muted-foreground">
                Please contact support if you need a QR code
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;