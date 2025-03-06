
import { useState } from "react";
import Layout from "@/components/Layout";
import { useMessaging } from "@/hooks/useMessaging";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ConversationList } from "@/components/messaging/ConversationList";
import { ConversationView } from "@/components/messaging/ConversationView";
import { NewMessageModal } from "@/components/messaging/NewMessageModal";

const MessagesPage = () => {
  const { user } = useAuth();
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

  return (
    <Layout>
      <div className="h-[calc(100vh-5rem)] overflow-hidden">
        <div className="grid md:grid-cols-3 h-full gap-4">
          {/* Left sidebar - conversation list */}
          <ConversationList
            conversations={conversations}
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
            loading={loading}
            user={user}
            messages={messages}
            onNewConversation={() => setShowNewMessageModal(true)}
          />
          
          {/* Right side - active conversation */}
          <ConversationView
            activeConversation={activeConversation}
            messages={messages}
            loading={loading}
            user={user}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            sendingMessage={sendingMessage}
            navigateToUserProfile={navigateToUserProfile}
            onNewConversation={() => setShowNewMessageModal(true)}
          />
        </div>
      </div>
      
      {/* New Message Modal */}
      <NewMessageModal
        showModal={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        onStartConversation={startNewConversation}
        currentUserId={user?.id}
      />
    </Layout>
  );
};

export default MessagesPage;
