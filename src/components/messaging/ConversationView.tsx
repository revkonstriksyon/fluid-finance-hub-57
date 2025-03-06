
import { useState } from "react";
import { Conversation, Message } from "@/types/messaging";
import { User } from "@supabase/supabase-js";
import { EmptyConversationView } from "./conversation/EmptyConversationView";
import { ConversationHeader } from "./conversation/ConversationHeader";
import { MessagesList } from "./conversation/MessagesList";
import { MessageInput } from "./conversation/MessageInput";
import { DeleteDialogs } from "./conversation/DeleteDialogs";

interface ConversationViewProps {
  activeConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  user: User | null;
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleSendMessage: () => void;
  sendingMessage: boolean;
  navigateToUserProfile: (userId: string) => void;
  onNewConversation: () => void;
  deleteMessage?: (messageId: string) => Promise<void>;
  deleteConversation?: (conversationId: string) => Promise<void>;
}

export const ConversationView = ({
  activeConversation,
  messages,
  loading,
  user,
  newMessage,
  setNewMessage,
  handleSendMessage,
  sendingMessage,
  navigateToUserProfile,
  onNewConversation,
  deleteMessage,
  deleteConversation
}: ConversationViewProps) => {
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [showDeleteConversationDialog, setShowDeleteConversationDialog] = useState(false);

  const handleDeleteMessage = async () => {
    if (messageToDelete && deleteMessage) {
      await deleteMessage(messageToDelete);
      setMessageToDelete(null);
    }
  };

  const handleDeleteConversation = async () => {
    if (activeConversation && deleteConversation) {
      await deleteConversation(activeConversation.id);
      setShowDeleteConversationDialog(false);
    }
  };

  if (!activeConversation) {
    return <EmptyConversationView onNewConversation={onNewConversation} />;
  }

  return (
    <div className="md:col-span-2 finance-card overflow-hidden flex flex-col">
      {/* Conversation header */}
      <ConversationHeader 
        activeConversation={activeConversation}
        navigateToUserProfile={navigateToUserProfile}
        openDeleteDialog={() => setShowDeleteConversationDialog(true)}
      />
      
      {/* Messages area */}
      <MessagesList 
        messages={messages}
        loading={loading}
        user={user}
        onDeleteMessage={deleteMessage ? setMessageToDelete : undefined}
      />
      
      {/* Message input */}
      <MessageInput 
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        sendingMessage={sendingMessage}
      />

      {/* Delete Dialogs */}
      <DeleteDialogs 
        messageToDelete={messageToDelete}
        showDeleteConversationDialog={showDeleteConversationDialog}
        setMessageToDelete={setMessageToDelete}
        setShowDeleteConversationDialog={setShowDeleteConversationDialog}
        handleDeleteMessage={handleDeleteMessage}
        handleDeleteConversation={handleDeleteConversation}
      />
    </div>
  );
};
