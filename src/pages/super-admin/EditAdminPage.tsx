import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface AdminData {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
}

const EditAdminPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/super-admin/admins/${id}`);
        setAdminData(response.data);
      } catch (err: any) {
        console.error('Failed to fetch admin data:', err);
        setError(err.response?.data?.message || 'Failed to load admin data.');
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to load admin data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'super_admin' && id) {
      fetchAdmin();
    } else if (!id) {
      setError('Admin ID is missing.');
      setLoading(false);
    }
  }, [id, user, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (adminData) {
      setAdminData({ ...adminData, [e.target.name]: e.target.value });
    }
  };

  const handleRoleChange = (value: 'user' | 'admin' | 'super_admin') => {
    if (adminData) {
      setAdminData({ ...adminData, role: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminData) return;

    setLoading(true);
    setError(null);
    try {
      await axios.patch(`${API_BASE_URL}/super-admin/admins/${id}`, adminData);
      toast({
        title: "Admin Updated",
        description: `Admin "${adminData.username}" updated successfully.`, 
        variant: "success",
      });
      navigate('/super-admin'); // Navigate back to super admin dashboard
    } catch (err: any) {
      console.error('Failed to update admin:', err);
      setError(err.response?.data?.message || 'Failed to update admin.');
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update admin.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-bg p-6 flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <CardTitle className="text-2xl mb-4">Loading Admin Data...</CardTitle>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen animated-bg p-6 flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <CardTitle className="text-2xl mb-4">Error</CardTitle>
          <CardDescription>{error}</CardDescription>
          <Button onClick={() => navigate('/super-admin')} className="mt-4">
            Return to Super Admin Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="min-h-screen animated-bg p-6 flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <CardTitle className="text-2xl mb-4">Admin Not Found</CardTitle>
          <CardDescription>The admin you are trying to edit does not exist.</CardDescription>
          <Button onClick={() => navigate('/super-admin')} className="mt-4">
            Return to Super Admin Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="container-responsive">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Edit Admin: {adminData.username}</CardTitle>
            <CardDescription>Modify admin user details and role.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" value={adminData.username} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={adminData.email} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={handleRoleChange} value={adminData.role}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating Admin...' : 'Update Admin'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditAdminPage;