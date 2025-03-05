
/**
 * Format phone number to ensure proper formatting for Supabase auth
 * @param phone raw phone number input
 * @returns formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // If the number doesn't start with +, add it
  // For Haiti, the country code is +509
  if (!phone.startsWith('+')) {
    // Check if it already has the Haiti country code without +
    if (digitsOnly.startsWith('509')) {
      return `+${digitsOnly}`;
    } else {
      // Assume Haiti number and add country code
      return `+509${digitsOnly}`;
    }
  }
  
  return phone;
};
