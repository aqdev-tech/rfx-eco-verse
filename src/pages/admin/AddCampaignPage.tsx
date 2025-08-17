import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const AddCampaignPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    rfxRewardPerAction: 0,
    co2ImpactPerAction: 0,
    targetParticipants: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/admin/campaigns', formData);
      // Optionally, redirect to the campaign management page
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error adding campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="container-responsive">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Add New Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rfxRewardPerAction">RFX Reward Per Action</Label>
                    <Input id="rfxRewardPerAction" name="rfxRewardPerAction" type="number" value={formData.rfxRewardPerAction} onChange={handleChange} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="co2ImpactPerAction">CO2 Impact Per Action</Label>
                    <Input id="co2ImpactPerAction" name="co2ImpactPerAction" type="number" value={formData.co2ImpactPerAction} onChange={handleChange} required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="targetParticipants">Target Participants</Label>
                  <Input id="targetParticipants" name="targetParticipants" type="number" value={formData.targetParticipants} onChange={handleChange} required />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" disabled={loading}>{loading ? 'Adding Campaign...' : 'Add Campaign'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddCampaignPage;
