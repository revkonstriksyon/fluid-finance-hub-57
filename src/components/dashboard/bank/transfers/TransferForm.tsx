
import { useState } from 'react';
import { BankAccount } from '@/types/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useTransactions } from '@/hooks/useTransactions';

interface TransferFormProps {
  bankAccounts: BankAccount[];
  user: User | null;
  refreshProfile: () => Promise<void>;
  selectedAccount: string;
  setSelectedAccount: (accountId: string) => void;
}

const TransferForm = ({ 
  bankAccounts, 
  user, 
  refreshProfile, 
  selectedAccount, 
  setSelectedAccount 
}: TransferFormProps) => {
  const { toast } = useToast();
  const { addTransaction } = useTransactions(user?.id);

  // Transfer states
  const [transferAmount, setTransferAmount] = useState(0);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [transferDescription, setTransferDescription] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  // Generate QR for transfer
  const handleGenerateQR = () => {
    toast({
      title: "Fonksyon pako disponib",
      description: "Jenerasyon kòd QR ap disponib byento.",
    });
  };

  // Handle transfer
  const handleTransfer = async () => {
    if (!selectedAccount) {
      toast({
        title: "Erè transfè",
        description: "Seleksyone yon kont pou fè transfè a.",
        variant: "destructive"
      });
      return;
    }
    
    if (transferAmount <= 0) {
      toast({
        title: "Erè transfè",
        description: "Antre yon montan ki pozitif.",
        variant: "destructive"
      });
      return;
    }
    
    if (!recipientPhone) {
      toast({
        title: "Erè transfè",
        description: "Antre nimewo telefòn destinatè a.",
        variant: "destructive"
      });
      return;
    }
    
    const account = bankAccounts.find(acc => acc.id === selectedAccount);
    if (!account) {
      toast({
        title: "Erè transfè",
        description: "Kont la pa valid.",
        variant: "destructive"
      });
      return;
    }
    
    if (transferAmount > account.balance) {
      toast({
        title: "Erè transfè",
        description: "Ou pa gen ase lajan nan kont ou a.",
        variant: "destructive"
      });
      return;
    }
    
    setIsTransferring(true);
    
    try {
      // Update sender's account balance
      const { error: balanceError } = await supabase
        .from('bank_accounts')
        .update({ 
          balance: account.balance - transferAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', account.id);

      if (balanceError) throw balanceError;

      // Create a transaction record
      await addTransaction({
        amount: -transferAmount, // Negative for outgoing transfer
        transaction_type: 'transfer',
        description: `Transfè a ${recipientPhone}${transferDescription ? ': ' + transferDescription : ''}`,
        account_id: account.id,
        user_id: user!.id
      });

      // Refresh profile to get updated accounts
      await refreshProfile();
      
      // Reset form
      setTransferAmount(0);
      setTransferDescription('');
      
      toast({
        title: "Transfè reyisi",
        description: `${transferAmount} HTG transfere a ${recipientPhone}.`,
      });
    } catch (error: any) {
      console.error('Error transferring:', error);
      toast({
        title: "Erè transfè",
        description: error.message || "Pa kapab fè transfè a. Tanpri eseye ankò.",
        variant: "destructive"
      });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfè pa Nimewo Telefòn</CardTitle>
        <CardDescription>Voye lajan bay yon moun lè w itilize nimewo telefòn yo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="source-account">Soti nan Kont</Label>
          <Select 
            value={selectedAccount} 
            onValueChange={setSelectedAccount}
            disabled={bankAccounts.length === 0}
          >
            <SelectTrigger id="source-account">
              <SelectValue placeholder="Chwazi kont" />
            </SelectTrigger>
            <SelectContent>
              {bankAccounts.map(account => (
                <SelectItem key={account.id} value={account.id}>
                  {account.account_name} - {account.currency} {account.balance.toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="recipient-phone">Nimewo Telefòn Destinatè</Label>
          <div className="flex">
            <Input
              id="recipient-phone"
              placeholder="+509"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
            />
            <Button 
              variant="outline" 
              className="ml-2"
              onClick={handleGenerateQR}
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="transfer-amount">Montan</Label>
          <Input
            id="transfer-amount"
            type="number"
            min="0"
            value={transferAmount || ''}
            onChange={(e) => setTransferAmount(Number(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="transfer-description">Deskripsyon (opsyonèl)</Label>
          <Input
            id="transfer-description"
            placeholder="Rezon transfè a"
            value={transferDescription}
            onChange={(e) => setTransferDescription(e.target.value)}
          />
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleTransfer}
          disabled={isTransferring || !selectedAccount || transferAmount <= 0 || !recipientPhone}
        >
          {isTransferring ? "Ap transfère..." : "Transfère Kounye a"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TransferForm;
