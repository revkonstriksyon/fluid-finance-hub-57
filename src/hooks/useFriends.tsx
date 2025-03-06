
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Friend, UserSearchResult } from "@/types/messaging";

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
      
      // Fetch all users except the current user, directly from profiles table
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .neq('id', user.id)
        .order('full_name', { ascending: true });
      
      if (usersError) throw usersError;
      
      // Get existing friend connections for these users
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select('id, user_id, friend_id, status')
        .or(
          `user_id.eq.${user.id},friend_id.eq.${user.id}`
        );
      
      if (friendsError) throw friendsError;
      
      // Map all users with friend status, directly using the profile data
      const usersWithFriendStatus = usersData.map(userData => {
        const friendConnection = friendsData?.find(f => 
          (f.user_id === userData.id && f.friend_id === user.id) || 
          (f.friend_id === userData.id && f.user_id === user.id)
        );
        
        return {
          ...userData,
          isFriend: friendConnection?.status === 'accepted',
          friendStatus: friendConnection?.status as "pending" | "accepted" | "rejected" | undefined
        };
      });
      
      setAllUsers(usersWithFriendStatus);
    } catch (error) {
      console.error('Error fetching all users:', error);
      toast({
        title: "Erè",
        description: "Nou pa kapab chaje tout itilizatè yo",
        variant: "destructive"
      });
    } finally {
      setLoadingAllUsers(false);
    }
  };

  // Fetch friends and friend requests
  const fetchFriends = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Fetch accepted friends
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select(`
          id,
          user_id,
          friend_id,
          status,
          created_at,
          updated_at,
          friend:profiles!friends_friend_id_fkey(id, full_name, username, avatar_url)
        `)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted');
      
      if (friendsError) throw friendsError;
      
      // Process friends data to ensure the friend property has the other user's info
      const processedFriends = friendsData.map(friend => {
        // Get friend profile data safely
        const friendProfile = Array.isArray(friend.friend) ? friend.friend[0] : friend.friend;
        
        // If the current user is the friend_id, swap the friend property to show the user info
        if (friend.friend_id === user.id) {
          return {
            ...friend,
            friend: { 
              id: friend.user_id,
              // We need to fetch the user_id's profile separately
              full_name: null,
              username: null,
              avatar_url: null
            }
          };
        }
        
        return {
          ...friend,
          friend: friendProfile
        };
      });
      
      // For each friend where we need to fetch the additional profile info
      const friendsWithProfiles = await Promise.all(processedFriends.map(async (friend) => {
        if (friend.friend_id === user.id) {
          // Fetch the profile for user_id
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, full_name, username, avatar_url')
            .eq('id', friend.user_id)
            .single();
          
          return {
            ...friend,
            friend: profileData
          };
        }
        return friend;
      }));
      
      // Explicitly cast to Friend[] type
      setFriends(friendsWithProfiles as Friend[]);
      
      // Fetch pending friend requests (where the current user is the friend_id)
      const { data: requestsData, error: requestsError } = await supabase
        .from('friends')
        .select(`
          id,
          user_id,
          friend_id,
          status,
          created_at,
          updated_at,
          friend:profiles!friends_user_id_fkey(id, full_name, username, avatar_url)
        `)
        .eq('friend_id', user.id)
        .eq('status', 'pending');
      
      if (requestsError) throw requestsError;
      
      // Handle case where friend could be an array
      const processedRequests = requestsData.map(request => ({
        ...request,
        friend: Array.isArray(request.friend) ? request.friend[0] : request.friend
      }));
      
      setFriendRequests(processedRequests as Friend[]);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast({
        title: "Erè",
        description: "Nou pa kapab chaje zanmi ou yo",
        variant: "destructive"
      });
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
