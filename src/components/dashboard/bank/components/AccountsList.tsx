
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { BankAccount } from '@/types/auth';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AccountCard from './AccountCard';

interface AccountsListProps {
  bankAccounts: BankAccount[];
  onSelectAccount: (account: BankAccount) => void;
  onCreateAccount: () => void;
  selectedAccount: BankAccount | null;
}

const AccountsList = ({ 
  bankAccounts, 
  onSelectAccount, 
  onCreateAccount, 
  selectedAccount 
}: AccountsListProps) => {
  
  if (bankAccounts.length === 0) {
    return (
      <Card className="col-span-3">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Ou pa gen okenn kont EBOUS. Ajoute youn pou kòmanse.</p>
          <Button className="mt-4" onClick={onCreateAccount}>
            <Plus className="h-4 w-4 mr-2" />
            Ajoute Kont EBOUS
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      {bankAccounts.map(account => (
        <AccountCard 
          key={account.id}
          account={account}
          isSelected={selectedAccount?.id === account.id}
          onClick={() => onSelectAccount(account)}
        />
      ))}
    </>
  );
};

export default AccountsList;
