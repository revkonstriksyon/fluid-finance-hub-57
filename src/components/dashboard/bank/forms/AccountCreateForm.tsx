
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '@supabase/supabase-js';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { DialogFooter } from '@/components/ui/dialog';
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
import { accountFormSchema, AccountFormValues } from '../schemas/accountFormSchema';
import { createBankAccount } from '../services/accountService';

interface AccountCreateFormProps {
  user: User | null;
  refreshProfile: () => Promise<void>;
  onClose: () => void;
}

const AccountCreateForm = ({ user, refreshProfile, onClose }: AccountCreateFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      accountName: '',
      accountType: 'current',
      initialDeposit: 0,
    },
  });

  const onSubmit = async (values: AccountFormValues) => {
    if (!user) {
      toast({
        title: "Erè",
        description: "Ou pa konekte. Tanpri konekte ankò.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createBankAccount(user.id, values);
      
      // Refresh profile to get updated accounts
      await refreshProfile();
      
      toast({
        title: "Kont kreye",
        description: "Kont ou an kreye avèk siksè.",
      });
      
      // Close dialog and reset form
      onClose();
      form.reset();
    } catch (error: any) {
      console.error('Error creating account:', error);
      toast({
        title: "Erè",
        description: error.message || 'Pa kapab kreye kont lan. Tanpri eseye ankò.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
};

export default AccountCreateForm;
