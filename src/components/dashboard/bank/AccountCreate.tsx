
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AccountCreateProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  refreshProfile: () => Promise<void>;
}

type AccountFormValues = {
  accountName: string;
  accountType: string;
  initialDeposit: number;
};

const AccountCreate = ({ isOpen, onClose, user, refreshProfile }: AccountCreateProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<AccountFormValues>({
    defaultValues: {
      accountName: '',
      accountType: 'current',
      initialDeposit: 0,
    },
  });

  const onSubmit = async (values: AccountFormValues) => {
    if (!user) {
      toast({
        title: 'Erè',
        description: 'Ou pa konekte. Tanpri konekte ankò.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate a random account number
      const accountNumber = `ACCT-${Math.floor(Math.random() * 90000) + 10000}`;
      
      // 1. Create the new bank account
      const { data: accountData, error: accountError } = await supabase
        .from('bank_accounts')
        .insert({
          user_id: user.id,
          account_name: values.accountName,
          account_type: values.accountType,
          account_number: accountNumber,
          balance: values.initialDeposit,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (accountError) throw accountError;

      // 2. If initial deposit is greater than 0, create a transaction record
      if (values.initialDeposit > 0) {
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            amount: values.initialDeposit,
            transaction_type: 'deposit',
            description: 'Depo inisyal',
            account_id: accountData.id,
            user_id: user.id,
          });

        if (transactionError) throw transactionError;
      }

      // 3. Refresh profile to get updated accounts
      await refreshProfile();
      
      toast({
        title: 'Kont kreye',
        description: 'Kont ou an kreye avèk siksè.',
      });
      
      // Close dialog and reset form
      onClose();
      form.reset();
    } catch (error: any) {
      console.error('Error creating account:', error);
      toast({
        title: 'Erè',
        description: error.message || 'Pa kapab kreye kont lan. Tanpri eseye ankò.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kreye nouvo kont</DialogTitle>
          <DialogDescription>
            Antre enfòmasyon pou kreye yon nouvo kont bankè.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Non kont lan</FormLabel>
                  <FormControl>
                    <Input placeholder="Kont kouran mwen" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tip kont</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chwazi yon tip kont" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="current">Kouran</SelectItem>
                      <SelectItem value="savings">Epay</SelectItem>
                      <SelectItem value="business">Biznis</SelectItem>
                      <SelectItem value="credit">Kredi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initialDeposit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Depo inisyal (HTG)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Anile
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Ap kreye...' : 'Kreye kont'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountCreate;
