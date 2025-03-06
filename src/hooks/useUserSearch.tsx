
import { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMessaging } from "@/hooks/useMessaging";
import { UserSearchResult } from "@/types/messaging";
import { searchUsersApi, sendFriendRequestApi } from "@/utils/userSearchApi";

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
      const results = await searchUsersApi(searchTerm, user.id);
      setSearchResults(results);
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
      await sendFriendRequestApi(user.id, friendId);
      
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
