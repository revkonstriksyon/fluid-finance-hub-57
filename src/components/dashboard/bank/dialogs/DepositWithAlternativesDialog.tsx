import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { BankAccount } from '@/types/auth';
import { ListChecks, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

interface DepositWithAlternativesDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  accounts: BankAccount[];
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string) => void;
  depositAmount: string;
  setDepositAmount: (amount: string) => void;
  depositMethod: string;
  setDepositMethod: (method: string) => void;
  handleDeposit: () => Promise<void>;
  processingDeposit: boolean;
}

export const DepositWithAlternativesDialog = ({
  open,
  setOpen,
  accounts,
  selectedAccountId,
  setSelectedAccountId,
  depositAmount,
  setDepositAmount,
  depositMethod,
  setDepositMethod,
  handleDeposit,
  processingDeposit
}: DepositWithAlternativesDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [processingAlternative, setProcessingAlternative] = useState(false);

  const handleAlternativeDeposit = async () => {
    if (!user || !selectedAccountId || !depositAmount || !depositMethod) {
      toast({
        title: "Erè",
        description: "Tanpri ranpli tout chan yo.",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessingAlternative(true);

      // Call the Supabase function
      const { data, error } = await supabase.functions.invoke('payment-gateway', {
        body: { amount: depositAmount, method: depositMethod }
      });

      if (error) {
        console.error("Error calling Supabase function:", error);
        toast({
          title: "Erè",
          description: error.message || "Yon erè pase pandan pwosesis depo a.",
          variant: "destructive",
        });
      } else {
        console.log("Supabase function response:", data);
        toast({
          title: "Depo Demande",
          description: "Yo te voye demann depo ou avèk siksè. Tcheke imèl ou pou plis detay.",
        });
        setOpen(false);
      }
    } catch (error: any) {
      console.error("Error during alternative deposit:", error);
      toast({
        title: "Erè",
        description: error.message || "Yon erè pase pandan pwosesis depo a.",
        variant: "destructive",
      });
    } finally {
      setProcessingAlternative(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fè Depo</DialogTitle>
          <DialogDescription>
            Chwazi metòd depo ou vle itilize a.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="account">Kont</Label>
            <Select onValueChange={setSelectedAccountId} defaultValue={selectedAccountId || ""}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chwazi yon kont" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.account_name} ({account.account_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount">Montan</Label>
            <Input
              type="number"
              id="amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="method">Metòd</Label>
            <Select onValueChange={setDepositMethod} defaultValue={depositMethod}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chwazi yon metòd" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Kat Kredi</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank_transfer">Transfè Bankè</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Anile
          </Button>
          <Button type="submit" onClick={handleAlternativeDeposit} disabled={processingAlternative}>
            {processingAlternative ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Pwosesis...
              </>
            ) : (
              <>
                <ListChecks className="mr-2 h-4 w-4" />
                Depo
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
