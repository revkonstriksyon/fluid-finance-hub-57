
import { useState } from 'react';
import { Search, Clock, UserPlus, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { UserSearchResult } from "@/types/messaging";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMessaging } from "@/hooks/useMessaging";

interface AddFriendsProps {
  fetchAllUsers: () => Promise<void>;
}

const AddFriends = ({ fetchAllUsers }: AddFriendsProps) => {
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
          ...user, // This ensures we use the exact profile data
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

  return (
    <>
      <h3 className="text-lg font-medium mb-4">Ajoute Zanmi</h3>
      
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-finance-charcoal/50 dark:text-white/50 h-4 w-4" />
          <Input 
            placeholder="Chèche itilizatè pa non oswa non itilizatè..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={handleSearch}
          disabled={isSearching || !searchTerm.trim()}
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Chèche
        </Button>
      </div>
      
      <div className="space-y-3">
        {searchResults.length === 0 ? (
          <p className="text-center py-4 text-finance-charcoal/70 dark:text-white/70">
            {searchTerm ? "Nou pa jwenn okenn itilizatè. Eseye chanje tèm rechèch la." : "Chèche itilizatè pou ajoute kòm zanmi."}
          </p>
        ) : (
          searchResults.map((result) => (
            <div key={result.id} className="flex items-center p-3 border border-finance-midGray/30 dark:border-white/10 rounded-lg">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={result.avatar_url || ""} />
                <AvatarFallback className="bg-finance-blue text-white">
                  {result.full_name 
                    ? result.full_name.split(' ').map(n => n[0]).join('')
                    : "??"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <p className="font-medium">{result.full_name || "Itilizatè"}</p>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                  @{result.username || "username"}
                </p>
              </div>
              
              <div>
                {result.isFriend ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => startConversation(result.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Mesaj
                  </Button>
                ) : result.friendStatus === 'pending' ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Annatant
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => sendFriendRequest(result.id)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajoute
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AddFriends;
