import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const ReviewSubmissionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await axios.get(`/api/admin/submissions/${id}`);
        setSubmission(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submission:', error);
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id]);

  const handleApprove = async () => {
    try {
      await axios.post(`/api/admin/submissions/${id}/approve`);
      navigate('/admin'); // Redirect to admin dashboard after action
    } catch (error) {
      console.error('Error approving submission:', error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.post(`/api/admin/submissions/${id}/reject`);
      navigate('/admin'); // Redirect to admin dashboard after action
    } catch (error) {
      console.error('Error rejecting submission:', error);
    }
  };

  if (loading) {
    return <p>Loading submission...</p>;
  }

  if (!submission) {
    return <p>Submission not found.</p>;
  }

  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="container-responsive">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Review Submission</CardTitle>
            <CardDescription>Details for submission by {submission.user.username}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p><strong>Campaign:</strong> {submission.campaign.title}</p>
              <p><strong>Type:</strong> {submission.type}</p>
              <p><strong>Status:</strong> {submission.status}</p>
              <p><strong>Submitted At:</strong> {new Date(submission.createdAt).toLocaleString()}</p>
              {/* Add more submission details here, e.g., image, video links */}
              
              <div className="flex space-x-4 mt-6">
                <Button onClick={handleApprove} className="bg-green-500 hover:bg-green-600">Approve</Button>
                <Button onClick={handleReject} className="bg-red-500 hover:bg-red-600">Reject</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewSubmissionPage;
