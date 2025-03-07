
import { Plus } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddAccountDialogProps {
  newAccountName: string;
  setNewAccountName: (name: string) => void;
  newAccountType: string;
  setNewAccountType: (type: string) => void;
  handleAddAccount: () => Promise<void>;
  processingAddAccount: boolean;
}

export const AddAccountDialog = ({
  newAccountName,
  setNewAccountName,
  newAccountType,
  setNewAccountType,
  handleAddAccount,
  processingAddAccount
}: AddAccountDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-dashed">
          <Plus className="h-4 w-4 mr-2" />
          Ajoute Nouvo Kont
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kreye Nouvo Kont</DialogTitle>
          <DialogDescription>
            Ranpli enfòmasyon yo pou kreye yon nouvo kont.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="account-name">Non Kont</Label>
            <Input 
              id="account-name" 
              value={newAccountName} 
              onChange={(e) => setNewAccountName(e.target.value)}
              placeholder="Ekri non kont lan"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="account-type">Tip Kont</Label>
            <Select value={newAccountType} onValueChange={setNewAccountType}>
              <SelectTrigger id="account-type">
                <SelectValue placeholder="Chwazi tip kont" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings">Kont Epay</SelectItem>
                <SelectItem value="checking">Kont Kouran</SelectItem>
                <SelectItem value="investment">Kont Envestisman</SelectItem>
                <SelectItem value="business">Kont Biznis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleAddAccount}
            disabled={processingAddAccount || !newAccountName || !newAccountType}
          >
            {processingAddAccount ? 'Ap trete...' : 'Kreye Kont'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
