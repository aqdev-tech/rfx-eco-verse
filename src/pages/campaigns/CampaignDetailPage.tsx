import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CampaignDetailPage = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await axios.get(`/api/campaigns/${id}`);
        setCampaign(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching campaign:', error);
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="container-responsive">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>View campaign information and participate</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading campaign details...</p>
            ) : campaign ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">{campaign.title}</h2>
                <p className="mb-4">{campaign.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold">Campaign Goal</h3>
                    <p>{campaign.goal}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Participants</h3>
                    <p>{campaign.participantsCount}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">RFX Reward per Action</h3>
                    <p>{campaign.rfxRewardPerAction}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">CO2 Impact per Action</h3>
                    <p>{campaign.co2ImpactPerAction} kg</p>
                  </div>
                </div>
                <Button>Participate</Button>
              </div>
            ) : (
              <p>Campaign not found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignDetailPage;