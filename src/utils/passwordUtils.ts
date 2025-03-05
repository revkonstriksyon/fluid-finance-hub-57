
export const validatePasswordStrength = (password: string): { 
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  score: number;
  feedback: string;
} => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  const isValid = hasMinLength && hasUppercase && hasNumber && hasSpecialChar;
  
  // Calculate score (0-4)
  let score = 0;
  if (hasMinLength) score++;
  if (hasUppercase) score++;
  if (hasNumber) score++;
  if (hasSpecialChar) score++;
  
  // Generate feedback
  let feedback = '';
  if (!hasMinLength) feedback += 'Modpas la dwe gen omwen 8 karaktè. ';
  if (!hasUppercase) feedback += 'Ajoute yon lèt majiskil. ';
  if (!hasNumber) feedback += 'Ajoute yon chif. ';
  if (!hasSpecialChar) feedback += 'Ajoute yon karaktè espesyal. ';
  
  if (isValid) {
    if (score === 4) feedback = 'Modpas fò';
    else feedback = 'Modpas akseptab';
  }
  
  return {
    isValid,
    hasMinLength,
    hasUppercase,
    hasNumber,
    hasSpecialChar,
    score,
    feedback
  };
};

export const generatePasswordSuggestion = (): string => {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%^&*_-+=';
  
  let password = '';
  
  // Add 1 uppercase letter
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  
  // Add 4-5 lowercase letters
  for (let i = 0; i < 4 + Math.floor(Math.random() * 2); i++) {
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  }
  
  // Add 1-2 numbers
  for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  // Add 1 special character
  password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};
