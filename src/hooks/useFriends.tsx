
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Friend, UserSearchResult } from "@/types/messaging";
import { fetchAllUsersApi, fetchFriendsApi } from "@/utils/friendsApi";

export const useFriends = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<UserSearchResult[]>([]);
  const [loadingAllUsers, setLoadingAllUsers] = useState(false);

  // Fetch all users in the database
  const fetchAllUsers = async () => {
    if (!user) return;
    
    try {
      setLoadingAllUsers(true);
      const usersWithFriendStatus = await fetchAllUsersApi(user.id);
      setAllUsers(usersWithFriendStatus);
    } catch (error) {
      console.error('Error in fetchAllUsers:', error);
    } finally {
      setLoadingAllUsers(false);
    }
  };

  // Fetch friends and friend requests
  const fetchFriends = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { friendsData, requestsData } = await fetchFriendsApi(user.id);
      setFriends(friendsData);
      setFriendRequests(requestsData);
    } catch (error) {
      console.error('Error in fetchFriends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscription for friend updates when component mounts
  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchAllUsers();
      
      // Set up real-time subscription for friend updates
      const friendsChannel = supabase
        .channel('public:friends')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'friends',
            filter: `user_id=eq.${user.id}`
          },
          () => fetchFriends()
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'friends',
            filter: `friend_id=eq.${user.id}`
          },
          () => fetchFriends()
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(friendsChannel);
      };
    }
  }, [user]);

  return {
    friends,
    friendRequests,
    isLoading,
    allUsers,
    loadingAllUsers,
    fetchFriends,
    fetchAllUsers
  };
};
