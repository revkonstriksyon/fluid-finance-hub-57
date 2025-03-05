
export const formatPhoneNumber = (phone: string): string => {
  // Remove any non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Ensure it has the country code, defaulting to +509 (Haiti) if not provided
  if (!cleaned.startsWith('509') && !cleaned.startsWith('+509')) {
    cleaned = `+509${cleaned}`;
  } else if (cleaned.startsWith('509')) {
    cleaned = `+${cleaned}`;
  }
  
  return cleaned;
};
