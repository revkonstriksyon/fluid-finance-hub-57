
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/hooks/useMessaging";
import { useMessageActions } from "@/hooks/useMessageActions";
import { ConversationList } from "./ConversationList";
import { ConversationView } from "./ConversationView";
import { NewMessageModal } from "./NewMessageModal";
import { User } from "@supabase/supabase-js";

interface MessagingContainerProps {
  user: User | null;
}

export const MessagingContainer = ({ user }: MessagingContainerProps) => {
  const {
    conversations, 
    activeConversation, 
    messages,
    loading,
    sendingMessage,
    setActiveConversation,
  } = useMessaging();
  
  const {
    newMessage,
    showNewMessageModal,
    setNewMessage,
    setShowNewMessageModal,
    handleSendMessage,
    startNewConversation,
    navigateToUserProfile
  } = useMessageActions();

  return (
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
      
      {/* New Message Modal */}
      <NewMessageModal
        showModal={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        onStartConversation={startNewConversation}
        currentUserId={user?.id}
      />
    </div>
  );
};
