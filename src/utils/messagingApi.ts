
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Conversation, Message } from "@/types/messaging";

/**
 * Fetches all conversations for the current user
 */
export const fetchConversationsApi = async (userId: string) => {
  try {
    console.log("Fetching conversations for user:", userId);
    const { data: conversationsData, error: conversationsError } = await supabase
      .from("conversations")
      .select("*")
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order("last_message_at", { ascending: false });
    
    if (conversationsError) throw conversationsError;
    
    console.log("Conversations data:", conversationsData);
    return conversationsData;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

/**
 * Fetches user profile data for a specific user
 */
export const fetchUserProfileApi = async (userId: string) => {
  try {
    console.log("Fetching profile for user:", userId);
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, username, avatar_url")
      .eq("id", userId)
      .single();
    
    if (profileError) throw profileError;
    
    console.log("Profile data:", profileData);
    return profileData;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

/**
 * Fetches the last message for a conversation
 */
export const fetchLastMessageApi = async (conversation: { user1_id: string, user2_id: string }) => {
  try {
    console.log("Fetching last message for conversation between users:", conversation.user1_id, conversation.user2_id);
    
    // We need to get messages where either user is the sender and the other is the receiver
    const { data: lastMessageData, error: lastMessageError } = await supabase
      .from("messages")
      .select("content, created_at, read")
      .or(
        `and(sender_id.eq.${conversation.user1_id},receiver_id.eq.${conversation.user2_id}),` +
        `and(sender_id.eq.${conversation.user2_id},receiver_id.eq.${conversation.user1_id})`
      )
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    if (lastMessageError && lastMessageError.code !== 'PGRST116') {
      console.error("Error fetching last message:", lastMessageError);
      throw lastMessageError;
    }
    
    console.log("Last message data:", lastMessageData);
    return lastMessageData;
  } catch (error) {
    console.error("Error fetching last message:", error);
    return null;
  }
};

/**
 * Fetches messages for a specific conversation
 */
export const fetchMessagesApi = async (conversation: { user1_id: string, user2_id: string }) => {
  try {
    console.log("Fetching messages for conversation between users:", conversation.user1_id, conversation.user2_id);
    
    // We need to get messages where either user is the sender and the other is the receiver
    const { data: messagesData, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${conversation.user1_id},receiver_id.eq.${conversation.user2_id}),` +
        `and(sender_id.eq.${conversation.user2_id},receiver_id.eq.${conversation.user1_id})`
      )
      .order("created_at", { ascending: true });
    
    if (messagesError) throw messagesError;
    
    console.log("Messages data:", messagesData);
    return messagesData || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

/**
 * Marks messages as read
 */
export const markMessagesAsReadApi = async (messageIds: string[]) => {
  if (messageIds.length === 0) return;
  
  try {
    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .in("id", messageIds);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
};

/**
 * Sends a new message
 */
export const sendMessageApi = async (
  senderId: string, 
  receiverId: string, 
  content: string, 
  conversationId: string
) => {
  try {
    // Add message to database
    const { data: messageData, error: messageError } = await supabase
      .from("messages")
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content: content.trim()
      })
      .select()
      .single();
    
    if (messageError) throw messageError;
    
    // Update conversation last_message_at
    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);
    
    return messageData;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

/**
 * Creates or retrieves an existing conversation
 */
export const createConversationApi = async (userId: string, otherUserId: string) => {
  try {
    // Check if conversation already exists
    const { data: existingConversation, error: existingError } = await supabase
      .from("conversations")
      .select("*")
      .or(`and(user1_id.eq.${userId},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${userId})`)
      .maybeSingle();
    
    if (existingError) throw existingError;
    
    if (existingConversation) {
      return existingConversation;
    }
    
    // Create new conversation
    const { data: newConversation, error: conversationError } = await supabase
      .from("conversations")
      .insert({
        user1_id: userId,
        user2_id: otherUserId
      })
      .select()
      .single();
    
    if (conversationError) throw conversationError;
    
    return newConversation;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};
