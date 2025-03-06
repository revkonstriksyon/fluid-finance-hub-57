
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteDialogsProps {
  messageToDelete: string | null;
  showDeleteConversationDialog: boolean;
  setMessageToDelete: (id: string | null) => void;
  setShowDeleteConversationDialog: (show: boolean) => void;
  handleDeleteMessage: () => void;
  handleDeleteConversation: () => void;
}

export const DeleteDialogs = ({
  messageToDelete,
  showDeleteConversationDialog,
  setMessageToDelete,
  setShowDeleteConversationDialog,
  handleDeleteMessage,
  handleDeleteConversation
}: DeleteDialogsProps) => {
  return (
    <>
      {/* Delete Message Dialog */}
      <AlertDialog open={!!messageToDelete} onOpenChange={(open) => !open && setMessageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Siprime Mesaj</AlertDialogTitle>
            <AlertDialogDescription>
              Èske ou sèten ou vle siprime mesaj sa a? Aksyon sa a pa kapab anile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anile</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMessage} className="bg-red-500 hover:bg-red-600">
              Siprime
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Conversation Dialog */}
      <AlertDialog open={showDeleteConversationDialog} onOpenChange={setShowDeleteConversationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Siprime Konvèsasyon</AlertDialogTitle>
            <AlertDialogDescription>
              Èske ou sèten ou vle siprime konvèsasyon sa a? Tout mesaj yo ap efase epi aksyon sa a pa kapab anile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anile</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConversation} className="bg-red-500 hover:bg-red-600">
              Siprime
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
