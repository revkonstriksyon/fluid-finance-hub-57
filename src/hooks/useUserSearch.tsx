
import { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMessaging } from "@/hooks/useMessaging";
import { supabase } from "@/lib/supabase";
import { UserSearchResult } from "@/types/messaging";

export const useUserSearch = (fetchAllUsers: () => Promise<void>) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createConversation } = useMessaging();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search users by name or username
  const handleSearch = async () => {
    if (!searchTerm.trim() || !user) return;
    
    try {
      setIsSearching(true);
      
      // Search directly from profiles table
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
        .neq('id', user.id)
        .limit(10);
      
      if (usersError) throw usersError;
      
      // Get existing friend connections for these users
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select('id, user_id, friend_id, status')
        .or(`user_id.eq.${user.id}.and.friend_id.in.(${usersData.map(u => `"${u.id}"`).join(',')}),
             friend_id.eq.${user.id}.and.user_id.in.(${usersData.map(u => `"${u.id}"`).join(',')})`)
        .is('status', 'accepted');
      
      if (friendsError && usersData.length > 0) throw friendsError;
      
      // Get pending friend requests
      const { data: pendingData, error: pendingError } = await supabase
        .from('friends')
        .select('id, user_id, friend_id, status')
        .or(`user_id.eq.${user.id}.and.friend_id.in.(${usersData.map(u => `"${u.id}"`).join(',')}),
             friend_id.eq.${user.id}.and.user_id.in.(${usersData.map(u => `"${u.id}"`).join(',')})`)
        .eq('status', 'pending');
      
      if (pendingError && usersData.length > 0) throw pendingError;
      
      // Map search results with friend status
      const resultsWithFriendStatus = usersData.map(user => {
        // Check if this user is already a friend
        const friendConnection = friendsData?.find(f => 
          (f.user_id === user.id || f.friend_id === user.id) && f.status === 'accepted'
        );
        
        // Check if there's a pending request
        const pendingConnection = pendingData?.find(p => 
          (p.user_id === user.id || p.friend_id === user.id) && p.status === 'pending'
        );
        
        return {
          ...user,
          isFriend: !!friendConnection,
          friendStatus: pendingConnection ? pendingConnection.status : undefined
        };
      });
      
      setSearchResults(resultsWithFriendStatus);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Erè",
        description: "Nou pa kapab chèche itilizatè yo",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Send a friend request
  const sendFriendRequest = async (friendId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'pending'
        });
      
      if (error) throw error;
      
      toast({
        title: "Siksè",
        description: "Demann zanmi a voye",
      });
      
      // Refresh search results and all users
      fetchAllUsers();
      handleSearch();
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Erè",
        description: "Nou pa kapab voye demann zanmi",
        variant: "destructive"
      });
    }
  };

  // Start a conversation with a friend
  const startConversation = async (friendId: string) => {
    if (!user) return;
    
    try {
      const conversation = await createConversation(friendId);
      if (conversation) {
        toast({
          title: "Siksè",
          description: "Konvèsasyon kreye",
        });
        
        // Redirect to messages page
        window.location.href = '/messages';
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Erè",
        description: "Nou pa kapab kreye konvèsasyon",
        variant: "destructive"
      });
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    handleSearch,
    sendFriendRequest,
    startConversation
  };
};
