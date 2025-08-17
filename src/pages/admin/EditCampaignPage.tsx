import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const EditCampaignPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    rfxRewardPerAction: 0,
    co2ImpactPerAction: 0,
    targetParticipants: 0,
    status: 'pending',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await axios.get(`/api/admin/campaigns/${id}`);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching campaign:', error);
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.patch(`/api/admin/campaigns/${id}`, formData);
      navigate('/admin/campaigns');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error updating campaign');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading campaign...</p>;
  }

  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="container-responsive">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Edit Campaign</CardTitle>
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
                <Button type="submit" disabled={loading}>{loading ? 'Updating Campaign...' : 'Update Campaign'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditCampaignPage;
