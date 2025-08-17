import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('/api/campaigns');
        if (Array.isArray(response.data)) {
          setCampaigns(response.data);
        } else {
          console.error('API response for campaigns is not an array:', response.data);
          setCampaigns([]); // Ensure campaigns is always an array
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="container-responsive">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Eco Campaigns</CardTitle>
            <CardDescription>Join environmental campaigns and make an impact</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading campaigns...</p>
            ) : campaigns.length === 0 ? (
              <p>No campaigns available at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                  <Card key={campaign._id} className="glass-card-secondary">
                    <CardHeader>
                      <CardTitle>{campaign.title}</CardTitle>
                      <CardDescription>{campaign.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to={`/campaigns/${campaign._id}`}>
                        <Button>View Details</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignsPage;