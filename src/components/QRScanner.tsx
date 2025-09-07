import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, CameraOff, User, Check } from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';
import { supabase } from '@/integrations/supabase/client';

interface QRScannerProps {
  eventId: string;
  onAttendanceMarked?: (studentData: any) => void;
}

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  srn?: string;
  college_name?: string;
  qr_code?: string;
}

const QRScanner: React.FC<QRScannerProps> = ({ eventId, onAttendanceMarked }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedStudent, setScannedStudent] = useState<StudentProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { markAttendance, loading } = useAttendance();

  const startScanning = async () => {
    if (!videoRef.current) return;

    try {
      scannerRef.current = new QrScanner(
        videoRef.current,
        async (result) => {
          if (result.data) {
            await handleQRCodeScanned(result.data);
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await scannerRef.current.start();
      setIsScanning(true);
      setError(null);
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError('Failed to start camera. Please ensure camera permissions are granted.');
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleQRCodeScanned = async (qrCode: string) => {
    try {
      // Stop scanning temporarily to prevent multiple scans
      stopScanning();

      // Find student by QR code
      const { data: student, error: studentError } = await supabase
        .from('profiles')
        .select('*')
        .eq('qr_code', qrCode)
        .single();

      if (studentError || !student) {
        setError('Invalid QR code or student not found.');
        return;
      }

      setScannedStudent(student);
    } catch (err) {
      console.error('Error processing QR code:', err);
      setError('Error processing QR code. Please try again.');
    }
  };

  const confirmAttendance = async () => {
    if (!scannedStudent) return;

    const { error } = await markAttendance(scannedStudent.id, eventId);
    
    if (!error) {
      onAttendanceMarked?.(scannedStudent);
      setScannedStudent(null);
      // Resume scanning after a short delay
      setTimeout(() => {
        if (!isScanning) {
          startScanning();
        }
      }, 2000);
    }
  };

  const resetScanner = () => {
    setScannedStudent(null);
    setError(null);
    if (!isScanning) {
      startScanning();
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>
            Scan student QR codes to mark attendance for this event
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isScanning && !scannedStudent && (
            <div className="text-center space-y-4">
              <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Camera not active</p>
                </div>
              </div>
              <Button onClick={startScanning} className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Start Scanning
              </Button>
            </div>
          )}

          {isScanning && (
            <div className="space-y-4">
              <video
                ref={videoRef}
                className="w-full h-64 rounded-lg object-cover"
                style={{ display: isScanning ? 'block' : 'none' }}
              />
              <Button onClick={stopScanning} variant="outline" className="w-full">
                <CameraOff className="h-4 w-4 mr-2" />
                Stop Scanning
              </Button>
            </div>
          )}

          {error && (
            <div className="text-center space-y-4">
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                {error}
              </div>
              <Button onClick={resetScanner} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {scannedStudent && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Student Found
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>
                    <p>{scannedStudent.name}</p>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <p>{scannedStudent.email}</p>
                  </div>
                  {scannedStudent.srn && (
                    <div>
                      <span className="font-medium">SRN:</span>
                      <p>{scannedStudent.srn}</p>
                    </div>
                  )}
                  {scannedStudent.college_name && (
                    <div>
                      <span className="font-medium">College:</span>
                      <p>{scannedStudent.college_name}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={confirmAttendance} 
                    disabled={loading}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {loading ? 'Marking...' : 'Mark Attendance'}
                  </Button>
                  <Button 
                    onClick={resetScanner} 
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;