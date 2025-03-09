
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Notification } from '@/types/auth';

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Error fetching notifications:', error);
          toast({
            title: "Erè nan jwenn notifikasyon yo",
            description: "Nou pa kapab jwenn notifikasyon ou yo pou kounye a.",
            variant: "destructive"
          });
        } else {
          setNotifications(data as Notification[]);
          setUnreadCount(data.filter((n: Notification) => !n.read).length);
        }
      } catch (error) {
        console.error('Error in fetchNotifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Set up real-time subscription for notifications
    const notificationsChannel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as Notification;
            
            // Show toast for new notification
            toast({
              title: "Nouvo Notifikasyon",
              description: newNotification.message
            });
            
            // Update state
            setNotifications(current => [newNotification, ...current]);
            setUnreadCount(count => count + 1);
          } else if (payload.eventType === 'UPDATE') {
            // Update notification in list
            setNotifications(current => 
              current.map(notification => 
                notification.id === payload.new.id ? payload.new as Notification : notification
              )
            );
            
            // Recalculate unread count
            setUnreadCount(current => 
              current - (payload.old.read === false && payload.new.read === true ? 1 : 0)
            );
          } else if (payload.eventType === 'DELETE') {
            // Remove notification from list
            setNotifications(current => 
              current.filter(notification => notification.id !== payload.old.id)
            );
            
            // Update unread count if deleting an unread notification
            if (!payload.old.read) {
              setUnreadCount(count => count - 1);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, [user, toast]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    if (!user) return { success: false };

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return { success: false };
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) return { success: false };

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return { success: false };
      }

      setUnreadCount(0);
      setNotifications(current => 
        current.map(notification => ({ ...notification, read: true }))
      );

      return { success: true };
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      return { success: false };
    }
  };

  // Send a notification (can be used for testing)
  const sendNotification = async (message: string, type: 'email' | 'sms' | 'in-app' = 'in-app') => {
    if (!user) return { success: false };

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          message,
          type,
          read: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending notification:', error);
        return { success: false };
      }

      return { success: true, notification: data };
    } catch (error) {
      console.error('Error in sendNotification:', error);
      return { success: false };
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    sendNotification
  };
};
