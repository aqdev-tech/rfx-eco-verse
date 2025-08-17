import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext'; // Assuming useAuth is needed for token

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface PlatformSetting {
  _id: string;
  key: string;
  value: string;
  description?: string;
}

const ConfigureSettingsPage = () => {
  const { user } = useAuth(); // To ensure user is super_admin, though ProtectedRoute handles it
  const [settings, setSettings] = useState<PlatformSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/super-admin/settings`);
        setSettings(response.data);
      } catch (err: any) {
        console.error('Failed to fetch platform settings:', err);
        setError(err.response?.data?.message || 'Failed to load settings.');
        toast({
          title: "Error",
          description: err.response?.data?.message || "Failed to load settings.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === 'super_admin') {
      fetchSettings();
    }
  }, [user, toast]);

  const handleSettingChange = (id: string, field: string, value: string) => {
    setSettings(prevSettings =>
      prevSettings.map(setting =>
        setting._id === id ? { ...setting, [field]: value } : setting
      )
    );
  };

  const handleUpdateSetting = async (setting: PlatformSetting) => {
    try {
      await axios.patch(`${API_BASE_URL}/super-admin/settings`, {
        key: setting.key,
        value: setting.value,
        description: setting.description,
      });
      toast({
        title: "Setting Updated",
        description: `Setting "${setting.key}" updated successfully.`, 
        variant: "success",
      });
    } catch (err: any) {
      console.error('Failed to update setting:', err);
      toast({
        title: "Error",
        description: err.response?.data?.message || `Failed to update setting "${setting.key}".`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen animated-bg p-6 flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <CardTitle className="text-2xl mb-4">Loading Platform Settings...</CardTitle>
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
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="container-responsive">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Configure Platform Settings</CardTitle>
            <CardDescription>Manage global platform parameters.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {settings.length > 0 ? (
                settings.map(setting => (
                  <div key={setting._id} className="p-4 border rounded-lg bg-muted/20">
                    <div className="grid gap-2 mb-3">
                      <Label htmlFor={`value-${setting._id}`} className="font-medium">{setting.key}</Label>
                      <Input
                        id={`value-${setting._id}`}
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting._id, 'value', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2 mb-3">
                      <Label htmlFor={`description-${setting._id}`} className="text-sm text-muted-foreground">Description</Label>
                      <Textarea
                        id={`description-${setting._id}`}
                        value={setting.description || ''}
                        onChange={(e) => handleSettingChange(setting._id, 'description', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <Button onClick={() => handleUpdateSetting(setting)} className="w-full">
                      Update {setting.key}
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No platform settings found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfigureSettingsPage;
