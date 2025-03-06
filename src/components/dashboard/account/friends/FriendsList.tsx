
import { useState, useEffect } from 'react';
import { MessageSquare, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { Friend, FriendProfile } from "@/types/messaging";
import { useMessaging } from "@/hooks/useMessaging";

interface FriendsListProps {
  friends: Friend[];
  isLoading: boolean;
  getFriendProfile: (friend: Friend) => FriendProfile;
  switchToTab: (tabValue: string) => void;
}

const FriendsList = ({ friends, isLoading, getFriendProfile, switchToTab }: FriendsListProps) => {
  const { createConversation } = useMessaging();

  // Start a conversation with a friend
  const startConversation = async (friendId: string) => {
    try {
      const conversation = await createConversation(friendId);
      if (conversation) {
        // Redirect to messages page
        window.location.href = '/messages';
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  return (
    <>
      <h3 className="text-lg font-medium mb-4">Zanmi</h3>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-finance-blue" />
        </div>
      ) : friends.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-finance-charcoal/70 dark:text-white/70">Ou pa gen okenn zanmi pou lemoman.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => switchToTab("add")}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Ajoute Zanmi
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {friends.map((friend) => {
            const friendProfile = getFriendProfile(friend);
            return (
              <div key={friend.id} className="flex items-center p-3 border border-finance-midGray/30 dark:border-white/10 rounded-lg hover:bg-finance-lightGray/50 dark:hover:bg-white/5 transition-colors">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={friendProfile?.avatar_url || ""} />
                  <AvatarFallback className="bg-finance-blue text-white">
                    {friendProfile?.full_name 
                      ? friendProfile.full_name.split(' ').map(n => n[0]).join('')
                      : "??"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <p className="font-medium">{friendProfile?.full_name || "Zanmi"}</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                    @{friendProfile?.username || "username"}
                  </p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => startConversation(friendProfile?.id || "")}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default FriendsList;
