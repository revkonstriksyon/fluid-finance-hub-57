
import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { Friend, FriendProfile } from "@/types/messaging";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface FriendRequestsProps {
  friendRequests: Friend[];
  isLoading: boolean;
  getFriendProfile: (friend: Friend) => FriendProfile;
  fetchFriends: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
}

const FriendRequests = ({ friendRequests, isLoading, getFriendProfile, fetchFriends, fetchAllUsers }: FriendRequestsProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [processingIds, setProcessingIds] = useState<Record<string, boolean>>({});

  // Set up real-time subscription for friend request updates
  useEffect(() => {
    if (!user) return;
    
    // Set up real-time subscription for friend updates
    const friendsChannel = supabase
      .channel('friend-requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friends',
          filter: `friend_id=eq.${user.id}`
        },
        () => {
          console.log("Friend request update detected");
          fetchFriends();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(friendsChannel);
    };
  }, [user, fetchFriends]);

  // Accept a friend request
  const acceptFriendRequest = async (requestId: string) => {
    try {
      setProcessingIds(prev => ({ ...prev, [requestId]: true }));
      
      const { error } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', requestId);
      
      if (error) throw error;
      
      toast({
        title: "Siksè",
        description: "Demann zanmi aksepte",
      });
      
      fetchFriends();
      fetchAllUsers(); // Refresh all users list
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Erè",
        description: "Nou pa kapab aksepte demann zanmi",
        variant: "destructive"
      });
    } finally {
      setProcessingIds(prev => ({ ...prev, [requestId]: false }));
    }
  };

  // Reject a friend request
  const rejectFriendRequest = async (requestId: string) => {
    try {
      setProcessingIds(prev => ({ ...prev, [requestId]: true }));
      
      const { error } = await supabase
        .from('friends')
        .update({ status: 'rejected' })
        .eq('id', requestId);
      
      if (error) throw error;
      
      toast({
        title: "Siksè",
        description: "Demann zanmi rejte",
      });
      
      fetchFriends();
      fetchAllUsers(); // Refresh all users list
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: "Erè",
        description: "Nou pa kapab rejte demann zanmi",
        variant: "destructive"
      });
    } finally {
      setProcessingIds(prev => ({ ...prev, [requestId]: false }));
    }
  };

  return (
    <>
      <h3 className="text-lg font-medium mb-4">Demann Zanmi</h3>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-finance-blue" />
        </div>
      ) : friendRequests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-finance-charcoal/70 dark:text-white/70">
            Ou pa gen okenn demann zanmi pou lemoman.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {friendRequests.map((request) => {
            const friendProfile = getFriendProfile(request);
            const isProcessing = processingIds[request.id] || false;
            
            return (
              <div key={request.id} className="flex items-center p-3 border border-finance-midGray/30 dark:border-white/10 rounded-lg">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={friendProfile?.avatar_url || ""} />
                  <AvatarFallback className="bg-finance-blue text-white">
                    {friendProfile?.full_name 
                      ? friendProfile.full_name.split(' ').map(n => n[0]).join('')
                      : "??"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <p className="font-medium">{friendProfile?.full_name || "Itilizatè"}</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                    @{friendProfile?.username || "username"}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => acceptFriendRequest(request.id)}
                    disabled={isProcessing}
                    className="border-green-500 text-green-500 hover:bg-green-500/10"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Aksepte
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => rejectFriendRequest(request.id)}
                    disabled={isProcessing}
                    className="border-red-500 text-red-500 hover:bg-red-500/10"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <X className="h-4 w-4 mr-2" />
                    )}
                    Rejte
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default FriendRequests;
