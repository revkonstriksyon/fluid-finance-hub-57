
import { createContext, useContext, ReactNode, useState } from "react";
import { useMessaging } from "@/hooks/useMessaging";
import { Conversation } from "@/types/messaging";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface MessagingContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: any[];
  loading: boolean;
  sendingMessage: boolean;
  newMessage: string;
  showNewMessageModal: boolean;
  setNewMessage: (message: string) => void;
  setActiveConversation: (conversation: Conversation) => void;
  setShowNewMessageModal: (show: boolean) => void;
  handleSendMessage: () => Promise<void>;
  startNewConversation: (userId: string) => Promise<void>;
  navigateToUserProfile: (userId: string) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const useMessagingContext = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error("useMessagingContext must be used within a MessagingProvider");
  }
  return context;
};

interface MessagingProviderProps {
  children: ReactNode;
  user: User | null;
}

export const MessagingProvider = ({ children, user }: MessagingProviderProps) => {
  const { toast } = useToast();
  const {
    conversations, 
    activeConversation, 
    messages,
    loading,
    sendingMessage,
    setActiveConversation,
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
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Erè",
        description: "Nou pa kapab kreye yon nouvo konvèsasyon",
        variant: "destructive"
      });
    }
  };

  // Function to view a user's profile
  const navigateToUserProfile = (userId: string) => {
    window.location.href = `/profile/${userId}`;
  };

  const value = {
    conversations,
    activeConversation,
    messages,
    loading,
    sendingMessage,
    newMessage,
    showNewMessageModal,
    setNewMessage,
    setActiveConversation,
    setShowNewMessageModal,
    handleSendMessage,
    startNewConversation,
    navigateToUserProfile
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};
