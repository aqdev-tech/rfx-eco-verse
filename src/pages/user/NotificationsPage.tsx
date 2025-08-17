import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (user) {
      try {
        setLoading(true);
        const response = await axios.get('/api/user/notifications');
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/user/notifications/${id}/read`);
      fetchNotifications(); // Refetch to update the list
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch('/api/user/notifications/mark-all-read');
      fetchNotifications(); // Refetch to update the list
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="container-responsive">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Stay updated with platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button onClick={markAllAsRead}>Mark All as Read</Button>
            </div>
            {loading ? (
              <p>Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p>You have no new notifications.</p>
            ) : (
              <ul className="space-y-4">
                {notifications.map((notification) => (
                  <li key={notification._id} className={`p-4 rounded-lg ${notification.read ? 'bg-gray-700' : 'bg-gray-800'}`}>
                    <div className="flex justify-between items-center">
                      <p>{notification.message}</p>
                      {!notification.read && (
                        <Button onClick={() => markAsRead(notification._id)} size="sm">Mark as Read</Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{new Date(notification.createdAt).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;