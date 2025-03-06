
import { Conversation } from "@/types/messaging";
import { fetchUserProfileApi, fetchLastMessageApi } from "./messagingApi";

/**
 * Enriches conversation data with user profiles and last message
 */
export const enrichConversationData = async (
  conversationsData: any[], 
  userId: string
): Promise<Conversation[]> => {
  // Fetch the other user's profile for each conversation
  const conversationsWithProfiles = await Promise.all(
    conversationsData.map(async (conversation) => {
      const otherUserId = conversation.user1_id === userId 
        ? conversation.user2_id 
        : conversation.user1_id;
      
      // Get the other user's profile
      const profileData = await fetchUserProfileApi(otherUserId);
      
      // Get the last message for this conversation
      const lastMessageData = await fetchLastMessageApi(conversation);
      
      return {
        ...conversation,
        otherUser: profileData ? { 
          ...profileData,
          // Simulate online status - in a real app, this would come from a presence system
          status: Math.random() > 0.5 ? "online" : (Math.random() > 0.5 ? "away" : "offline")
        } : undefined,
        lastMessage: lastMessageData || undefined
      };
    })
  );
  
  return conversationsWithProfiles;
};
