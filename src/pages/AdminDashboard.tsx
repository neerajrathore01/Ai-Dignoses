import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Activity, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/db/supabase';
import { profilesApi, predictionsApi } from '@/db/api';
import type { Profile, Prediction } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const profile = await profilesApi.getCurrentProfile();
      
      if (!profile || profile.role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access this page',
          variant: 'destructive',
        });
        navigate('/dashboard');
        return;
      }

      setIsAdmin(true);

      const [profilesData, predictionsData] = await Promise.all([
        profilesApi.getAllProfiles(),
        predictionsApi.getAllPredictions(),
      ]);

      setProfiles(profilesData);
      setPredictions(predictionsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    const success = await profilesApi.updateProfileRole(userId, newRole);
    
    if (success) {
      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });
      checkAdminAndLoadData();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const stats = {
    totalUsers: profiles.length,
    totalPredictions: predictions.length,
    admins: profiles.filter(p => p.role === 'admin').length,
    thisMonth: predictions.filter(p => {
      const date = new Date(p.created_at);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 xl:py-12">
          <div className="mx-auto max-w-7xl">
            <Skeleton className="mb-8 h-12 w-64 bg-muted" />
            <div className="mb-8 grid gap-4 xl:grid-cols-4">
              <Skeleton className="h-32 bg-muted" />
              <Skeleton className="h-32 bg-muted" />
              <Skeleton className="h-32 bg-muted" />
              <Skeleton className="h-32 bg-muted" />
            </div>
            <Skeleton className="h-96 bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 xl:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-foreground xl:text-4xl">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage users and view system statistics
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              My Dashboard
            </Button>
          </div>

          <div className="mb-8 grid gap-4 xl:grid-cols-4">
            <Card className="medical-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Registered accounts
                </p>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Administrators
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.admins}</div>
                <p className="text-xs text-muted-foreground">
                  Admin accounts
                </p>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Predictions
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPredictions}</div>
                <p className="text-xs text-muted-foreground">
                  All time analyses
                </p>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Month
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.thisMonth}</div>
                <p className="text-xs text-muted-foreground">
                  Recent predictions
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="medical-card">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">
                        {profile.email || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                          {profile.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(profile.created_at)}</TableCell>
                      <TableCell>
                        <Select
                          value={profile.role}
                          onValueChange={(value: 'user' | 'admin') => 
                            handleRoleChange(profile.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="medical-card mt-8">
            <CardHeader>
              <CardTitle>Recent Predictions</CardTitle>
              <CardDescription>
                Latest symptom analyses across all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Disease</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {predictions.slice(0, 10).map((prediction) => {
                    const user = profiles.find(p => p.id === prediction.user_id);
                    return (
                      <TableRow key={prediction.id}>
                        <TableCell>{user?.email || 'Unknown'}</TableCell>
                        <TableCell className="font-medium">
                          {prediction.disease_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {prediction.confidence}%
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(prediction.created_at)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
