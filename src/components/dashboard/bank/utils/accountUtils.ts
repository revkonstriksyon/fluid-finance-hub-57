
// Helper to get account type display name
export const getAccountTypeName = (accountType: string) => {
  const types: Record<string, string> = {
    'current': 'Kouran',
    'savings': 'Epay',
    'business': 'Biznis',
    'credit': 'Kredi'
  };
  return types[accountType] || accountType;
};
