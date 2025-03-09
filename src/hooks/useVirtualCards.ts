
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { VirtualCard } from '@/types/auth';

export const useVirtualCards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingCreate, setProcessingCreate] = useState(false);
  const [processingTopUp, setProcessingTopUp] = useState(false);
  const [processingDeactivate, setProcessingDeactivate] = useState(false);

  // Fetch virtual cards
  useEffect(() => {
    if (!user) return;

    const fetchCards = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('virtual_cards')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching virtual cards:', error);
          toast({
            title: "Erè nan jwenn kat yo",
            description: "Nou pa kapab jwenn kat vityèl ou yo pou kounye a.",
            variant: "destructive"
          });
        } else {
          setCards(data as VirtualCard[]);
        }
      } catch (error) {
        console.error('Error in fetchCards:', error);
        toast({
          title: "Erè nan kominikasyon",
          description: "Gen yon erè ki pase pandan nou t ap jwenn kat ou yo.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCards();

    // Set up real-time subscription for virtual cards
    const cardsChannel = supabase
      .channel('virtual-cards-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'virtual_cards', filter: `user_id=eq.${user.id}` }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCards(current => [payload.new as VirtualCard, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setCards(current => current.map(card => 
              card.id === payload.new.id ? payload.new as VirtualCard : card
            ));
          } else if (payload.eventType === 'DELETE') {
            setCards(current => current.filter(card => card.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(cardsChannel);
    };
  }, [user, toast]);

  // Generate a random test card number that passes Luhn algorithm
  const generateTestCardNumber = () => {
    // For test purposes, we'll use a Visa test card prefix
    const prefix = '4242';
    const length = 16;
    
    // Generate random digits for the middle part
    let number = prefix;
    for (let i = prefix.length; i < length - 1; i++) {
      number += Math.floor(Math.random() * 10);
    }
    
    // Calculate checksum using Luhn algorithm
    let sum = 0;
    let alternate = false;
    for (let i = number.length - 1; i >= 0; i--) {
      let n = parseInt(number.substring(i, i + 1));
      if (alternate) {
        n *= 2;
        if (n > 9) {
          n = (n % 10) + 1;
        }
      }
      sum += n;
      alternate = !alternate;
    }
    
    // Add check digit
    const checkDigit = (10 - (sum % 10)) % 10;
    number += checkDigit;
    
    return number;
  };

  // Generate random CVV
  const generateCVV = () => {
    return Math.floor(100 + Math.random() * 900).toString();
  };

  // Generate expiration date (2 years from now)
  const generateExpiration = () => {
    const today = new Date();
    const expYear = today.getFullYear() + 2;
    const expMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    return `${expMonth}/${expYear.toString().slice(-2)}`;
  };

  // Create a new virtual card
  const createVirtualCard = async (initialBalance: number = 0) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou kreye yon kat vityèl.",
        variant: "destructive"
      });
      return { success: false };
    }

    setProcessingCreate(true);
    try {
      const cardNumber = generateTestCardNumber();
      const cvv = generateCVV();
      const expiration = generateExpiration();
      
      const { data, error } = await supabase
        .from('virtual_cards')
        .insert({
          user_id: user.id,
          card_number: cardNumber,
          cvv: cvv,
          expiration: expiration,
          balance: initialBalance,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating virtual card:', error);
        toast({
          title: "Kreyasyon kat echwe",
          description: "Nou pa t kapab kreye kat vityèl ou a. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      toast({
        title: "Kat kreye",
        description: "Ou kreye yon nouvo kat vityèl.",
      });
      
      return { success: true, card: data as VirtualCard };
    } catch (error) {
      console.error('Error in createVirtualCard:', error);
      toast({
        title: "Kreyasyon kat echwe",
        description: "Gen yon erè ki pase pandan n ap eseye kreye kat vityèl la.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setProcessingCreate(false);
    }
  };

  // Top up a virtual card
  const topUpVirtualCard = async (cardId: string, amount: number, sourceAccountId: string) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou fè yon depo sou kat.",
        variant: "destructive"
      });
      return { success: false };
    }

    if (amount <= 0) {
      toast({
        title: "Montan envalid",
        description: "Montan depo a dwe pi plis ke zewo.",
        variant: "destructive"
      });
      return { success: false };
    }

    setProcessingTopUp(true);
    try {
      // Get current account balance
      const { data: accountData, error: accountError } = await supabase
        .from('bank_accounts')
        .select('balance')
        .eq('id', sourceAccountId)
        .eq('user_id', user.id)
        .single();

      if (accountError || !accountData) {
        console.error('Error fetching account balance:', accountError);
        toast({
          title: "Depo sou kat echwe",
          description: "Nou pa t kapab verifye balans ou. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      if (accountData.balance < amount) {
        toast({
          title: "Balans ensifizan",
          description: "Ou pa gen ase lajan nan kont la pou fè depo sa a.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Get current card
      const { data: cardData, error: cardError } = await supabase
        .from('virtual_cards')
        .select('*')
        .eq('id', cardId)
        .eq('user_id', user.id)
        .single();

      if (cardError || !cardData) {
        console.error('Error fetching card:', cardError);
        toast({
          title: "Depo sou kat echwe",
          description: "Nou pa t kapab jwenn kat vityèl la. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      if (!cardData.is_active) {
        toast({
          title: "Kat inaktif",
          description: "Kat vityèl sa a inaktif. Ou pa kapab fè depo sou li.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Create a transaction for the withdrawal from bank account
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          account_id: sourceAccountId,
          transaction_type: 'withdrawal',
          amount: amount,
          description: `Depo sou kat vityèl se ${cardData.card_number.slice(-4)}`,
          status: 'completed'
        })
        .select()
        .single();

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        toast({
          title: "Depo sou kat echwe",
          description: "Nou pa t kapab trete depo ou a. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      // Update the card balance
      const { data: updatedCard, error: updateError } = await supabase
        .from('virtual_cards')
        .update({
          balance: cardData.balance + amount
        })
        .eq('id', cardId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating card balance:', updateError);
        toast({
          title: "Depo sou kat echwe",
          description: "Nou pa t kapab mete ajou balans kat la. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      toast({
        title: "Depo reyisi",
        description: `Ou depoze $${amount} sou kat vityèl ou.`,
      });
      
      return { success: true, card: updatedCard as VirtualCard };
    } catch (error) {
      console.error('Error in topUpVirtualCard:', error);
      toast({
        title: "Depo sou kat echwe",
        description: "Gen yon erè ki pase pandan n ap eseye fè depo a.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setProcessingTopUp(false);
    }
  };

  // Deactivate a virtual card
  const deactivateVirtualCard = async (cardId: string) => {
    if (!user) {
      toast({
        title: "Koneksyon obligatwa",
        description: "Ou dwe konekte pou dezaktive yon kat vityèl.",
        variant: "destructive"
      });
      return { success: false };
    }

    setProcessingDeactivate(true);
    try {
      const { data, error } = await supabase
        .from('virtual_cards')
        .update({
          is_active: false
        })
        .eq('id', cardId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error deactivating card:', error);
        toast({
          title: "Dezaktivasyon echwe",
          description: "Nou pa t kapab dezaktive kat vityèl ou a. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { success: false };
      }

      toast({
        title: "Kat dezaktive",
        description: "Ou dezaktive kat vityèl ou a avèk siksè.",
      });
      
      return { success: true, card: data as VirtualCard };
    } catch (error) {
      console.error('Error in deactivateVirtualCard:', error);
      toast({
        title: "Dezaktivasyon echwe",
        description: "Gen yon erè ki pase pandan n ap eseye dezaktive kat la.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setProcessingDeactivate(false);
    }
  };

  return {
    cards,
    loading,
    processingCreate,
    processingTopUp,
    processingDeactivate,
    createVirtualCard,
    topUpVirtualCard,
    deactivateVirtualCard
  };
};
