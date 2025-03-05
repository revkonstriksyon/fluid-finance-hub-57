
import { User } from '@supabase/supabase-js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import AccountCreateForm from './forms/AccountCreateForm';

interface AccountCreateProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  refreshProfile: () => Promise<void>;
}

const AccountCreate = ({ isOpen, onClose, user, refreshProfile }: AccountCreateProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kreye nouvo kont</DialogTitle>
          <DialogDescription>
            Antre enfòmasyon pou kreye yon nouvo kont bankè.
          </DialogDescription>
        </DialogHeader>
        <AccountCreateForm 
          user={user} 
          refreshProfile={refreshProfile} 
          onClose={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default AccountCreate;
