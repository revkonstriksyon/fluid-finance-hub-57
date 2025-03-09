
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.37.0'

// Configure Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Cors headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }
}

// Function to initialize payment with payment gateway
const initializePayment = async (req: Request) => {
  try {
    const { method, amount, phone, userId, accountId, description } = await req.json();
    
    // Validate input
    if (!method || !amount || !phone || !userId || !accountId) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields. Required: method, amount, phone, userId, accountId' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }
    
    // Check if method is supported
    if (!['moncash', 'natcash'].includes(method)) {
      return new Response(
        JSON.stringify({ error: 'Unsupported payment method' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }
    
    // Check account exists
    const { data: accountData, error: accountError } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('user_id', userId)
      .single();
      
    if (accountError || !accountData) {
      return new Response(
        JSON.stringify({ error: 'Invalid account' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    // In a real implementation, we would make API calls to the payment gateway
    // Generate a transaction reference
    const transactionRef = crypto.randomUUID();
    
    // Create a pending transaction in the database
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        account_id: accountId,
        transaction_type: 'deposit',
        amount,
        description: description || `Depo via ${method} (${phone})`,
        status: 'pending',
        reference_id: transactionRef
      })
      .select()
      .single();
    
    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create transaction', details: transactionError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }

    // Create a notification for the user
    await supabase.from('notifications')
      .insert({
        user_id: userId,
        message: `Depo $${amount} via ${method} inisye. Tann konfimasyon.`,
        type: 'in-app',
        read: false
      });
    
    console.log(`Payment initialized: ${method} payment of ${amount} for user ${userId}`);
    
    // Return transaction details and payment gateway information
    return new Response(
      JSON.stringify({ 
        success: true,
        transaction,
        gateway: {
          reference: transactionRef,
          paymentUrl: `https://example.com/pay/${method}/${transactionRef}`,
          phone,
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in initializePayment:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
}

// Function to verify payment status
const verifyPayment = async (req: Request) => {
  try {
    const { transactionId } = await req.json();
    
    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: 'Transaction ID is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }
    
    // Get the transaction from the database
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();
    
    if (transactionError) {
      console.error('Error fetching transaction:', transactionError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch transaction', details: transactionError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }
    
    if (!transaction) {
      return new Response(
        JSON.stringify({ error: 'Transaction not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 404 
        }
      );
    }
    
    // In a real implementation, we would make API calls to the payment gateway
    // For demo purposes, we'll simulate a successful payment
    
    // Simulate a random success/failure
    const isSuccessful = Math.random() > 0.2; // 80% success rate
    
    if (isSuccessful) {
      // Use the database function to update the transaction to 'completed'
      // This will also update the account balance
      const { data: updated, error: updateError } = await supabase
        .rpc('finalize_transaction', {
          p_transaction_id: transactionId,
          p_status: 'completed'
        });
      
      if (updateError) {
        console.error('Error updating transaction:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update transaction', details: updateError }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 500 
          }
        );
      }

      // Create a notification for the user
      await supabase.from('notifications')
        .insert({
          user_id: transaction.user_id,
          message: `Depo $${transaction.amount} konplete avèk siksè.`,
          type: 'in-app',
          read: false
        });
      
      console.log(`Payment verified successfully for transaction ${transactionId}`);
      
      return new Response(
        JSON.stringify({ 
          success: true,
          status: 'completed',
          message: 'Payment successful',
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 200 
        }
      );
    } else {
      // Update the transaction to 'failed'
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ status: 'failed' })
        .eq('id', transactionId);
      
      if (updateError) {
        console.error('Error updating transaction:', updateError);
      }

      // Create a notification for the user
      await supabase.from('notifications')
        .insert({
          user_id: transaction.user_id,
          message: `Depo $${transaction.amount} echwe. Tanpri eseye ankò.`,
          type: 'in-app',
          read: false
        });
      
      console.log(`Payment verification failed for transaction ${transactionId}`);
      
      return new Response(
        JSON.stringify({ 
          success: false,
          status: 'failed',
          message: 'Payment failed or cancelled by user',
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 200 
        }
      );
    }
  } catch (error) {
    console.error('Error in verifyPayment:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  const url = new URL(req.url);
  const path = url.pathname.split('/').pop();
  
  if (req.method === 'POST') {
    if (path === 'initialize') {
      return await initializePayment(req);
    } else if (path === 'verify') {
      return await verifyPayment(req);
    }
  }
  
  return new Response(
    JSON.stringify({ error: 'Not found' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 404 
    }
  );
})
