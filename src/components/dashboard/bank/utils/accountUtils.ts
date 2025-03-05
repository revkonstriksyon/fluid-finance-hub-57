
// Helper to get account type display name
export const getAccountTypeName = (accountType: string) => {
  const types: Record<string, string> = {
    'current': 'EBOUS Kouran',
    'savings': 'EBOUS Epay',
    'business': 'EBOUS Biznis',
    'credit': 'EBOUS Kredi'
  };
  return types[accountType] || accountType;
};
