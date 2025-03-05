
import { BankAccount } from '@/types/auth';
import { Card, CardContent } from "@/components/ui/card";
import { WalletCards } from 'lucide-react';
import { getAccountTypeName } from '../utils/accountUtils';

interface AccountCardProps {
  account: BankAccount;
  isSelected: boolean;
  onClick: () => void;
}

const AccountCard = ({ account, isSelected, onClick }: AccountCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{account.account_name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {account.account_type && `${getAccountTypeName(account.account_type)} • `}
              Nimewo: {account.account_number}
            </p>
          </div>
          <WalletCards className="h-8 w-8 text-primary" />
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">Balans Aktyèl</p>
          <p className="text-3xl font-bold mt-1">
            {account.currency} {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
