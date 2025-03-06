
import { useState } from "react";
import { useMessaging } from "./useMessaging";
import { useToast } from "./use-toast";
import { Conversation } from "@/types/messaging";

export const useMessageActions = () => {
  const { toast } = useToast();
  const {
    activeConversation,
    sendMessage,
    createConversation
  } = useMessaging();
  
  const [newMessage, setNewMessage] = useState("");
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !activeConversation) return;
    
    await sendMessage(newMessage);
    setNewMessage("");
  };

  // Function to start a new conversation
  const startNewConversation = async (userId: string) => {
    if (!userId) return;
    
    try {
      const newConversation = await createConversation(userId);
      
      if (newConversation) {
        setShowNewMessageModal(false);
      }
      return newConversation;
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Erè",
        description: "Nou pa kapab kreye yon nouvo konvèsasyon",
        variant: "destructive"
      });
      return null;
    }
  };

  // Function to view a user's profile
  const navigateToUserProfile = (userId: string) => {
    window.location.href = `/profile/${userId}`;
  };

  return {
    newMessage,
    showNewMessageModal,
    setNewMessage,
    setShowNewMessageModal,
    handleSendMessage,
    startNewConversation,
    navigateToUserProfile
  };
};
