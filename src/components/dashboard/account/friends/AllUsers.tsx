
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

interface AllUsersProps {
  allUsers: UserSearchResult[];
  loadingAllUsers: boolean;
  userSearchTerm: string;
  setUserSearchTerm: (term: string) => void;
  fetchAllUsers: () => Promise<void>;
}

const AllUsers = ({ 
  allUsers, 
  loadingAllUsers, 
  userSearchTerm, 
  setUserSearchTerm,
  fetchAllUsers
}: AllUsersProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createConversation } = useMessaging();

  // Filter all users based on search term
  const filterUsers = () => {
    if (!userSearchTerm.trim()) {
      return allUsers;
    }
    
    return allUsers.filter(user => 
      user.full_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
      user.username?.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
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
      
      fetchAllUsers();
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
      <h3 className="text-lg font-medium mb-4">Tout Itilizatè</h3>
      
      {loadingAllUsers ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-finance-blue" />
        </div>
      ) : (
        <div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-finance-charcoal/50 dark:text-white/50 h-4 w-4" />
            <Input 
              placeholder="Filtè itilizatè yo..." 
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="space-y-3 mt-4 max-h-[400px] overflow-y-auto pr-2">
            {filterUsers().length === 0 ? (
              <p className="text-center py-4 text-finance-charcoal/70 dark:text-white/70">
                {allUsers.length === 0 ? "Pa gen okenn itilizatè nan sistèm nan." : "Pa gen okenn itilizatè ki koresponn ak rechèch la."}
              </p>
            ) : (
              filterUsers().map((profileUser) => (
                <div key={profileUser.id} className="flex items-center p-3 border border-finance-midGray/30 dark:border-white/10 rounded-lg">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={profileUser.avatar_url || ""} />
                    <AvatarFallback className="bg-finance-blue text-white">
                      {profileUser.full_name 
                        ? profileUser.full_name.split(' ').map(n => n[0]).join('')
                        : "??"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <p className="font-medium">{profileUser.full_name || "Itilizatè"}</p>
                    <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                      @{profileUser.username || "username"}
                    </p>
                  </div>
                  
                  <div>
                    {profileUser.isFriend ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => startConversation(profileUser.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Mesaj
                      </Button>
                    ) : profileUser.friendStatus === 'pending' ? (
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
                        onClick={() => sendFriendRequest(profileUser.id)}
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
        </div>
      )}
    </>
  );
};

export default AllUsers;
