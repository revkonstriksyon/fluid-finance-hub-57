
import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Conversation } from "@/types/messaging";
import { fetchConversationsApi, createConversationApi } from "@/utils/messagingApi";
import { enrichConversationData } from "@/utils/conversationHelpers";

export const useConversationOperations = (
  setConversations: (convs: Conversation[]) => void,
  setActiveConversation: (conv: Conversation | null) => void,
  activeConversation: Conversation | null,
  fetchingRef: React.MutableRefObject<boolean>,
  fetchMessages: (conversationId: string) => Promise<void>,
  setLoading: (loading: boolean) => void
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch all conversations for the current user
  const fetchConversations = useCallback(async (skipLoading = false) => {
    if (!user || fetchingRef.current) return;
    
    try {
      if (!skipLoading) setLoading(true);
      fetchingRef.current = true;
      
      const conversationsData = await fetchConversationsApi(user.id);
      const enrichedConversations = await enrichConversationData(conversationsData, user.id);
      
      setConversations(enrichedConversations);
      
      // Set the first conversation as active if none is selected
      if (enrichedConversations.length > 0 && !activeConversation) {
        setActiveConversation(enrichedConversations[0]);
        await fetchMessages(enrichedConversations[0].id);
      } else if (activeConversation) {
        // Update the active conversation with new data without changing selection
        const updatedActiveConversation = enrichedConversations.find(
          conv => conv.id === activeConversation.id
        );
        
        if (updatedActiveConversation) {
          setActiveConversation(updatedActiveConversation);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Erè",
        description: "Nou pa kapab chaje konvèsasyon yo",
        variant: "destructive"
      });
    } finally {
      if (!skipLoading) setLoading(false);
      fetchingRef.current = false;
    }
  }, [user, activeConversation, toast, setConversations, setActiveConversation, fetchMessages, setLoading, fetchingRef]);

  // Create a new conversation with another user
  const createConversation = useCallback(async (otherUserId: string) => {
    if (!user || user.id === otherUserId) return null;
    
    try {
      const newConversation = await createConversationApi(user.id, otherUserId);
      
      // Refresh conversations to include the new one
      await fetchConversations();
      
      // Find and activate the new conversation
      const allConversations = await fetchConversationsApi(user.id);
      const enrichedConversations = await enrichConversationData(allConversations, user.id);
      
      const fullConversation = enrichedConversations.find(c => c.id === newConversation.id);
      if (fullConversation) {
        setActiveConversation(fullConversation);
        await fetchMessages(fullConversation.id);
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
  }, [user, fetchConversations, fetchMessages, setActiveConversation, toast]);

  return {
    fetchConversations,
    createConversation
  };
};
