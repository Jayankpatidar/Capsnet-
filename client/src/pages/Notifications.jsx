import React, { useEffect, useState } from 'react';
import { Bell, Heart, MessageSquare, UserPlus, Briefcase } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      toast.error('Failed to fetch notifications');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'follow': return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'job': return <Briefcase className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-2xl p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Notifications</h1>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500">No notifications yet</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif._id} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow">
              {getIcon(notif.type)}
              <div className="flex-1">
                <p className="text-sm text-gray-800">{notif.message}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
