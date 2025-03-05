
import { useState, useEffect } from "react";
import { validatePasswordStrength } from "@/utils/passwordUtils";

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

const PasswordStrengthMeter = ({ password, className = "" }: PasswordStrengthMeterProps) => {
  const [strength, setStrength] = useState({
    score: 0,
    feedback: "",
    hasMinLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  useEffect(() => {
    if (password) {
      const result = validatePasswordStrength(password);
      setStrength(result);
    } else {
      setStrength({
        score: 0,
        feedback: "",
        hasMinLength: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false
      });
    }
  }, [password]);

  const getStrengthClass = () => {
    switch (strength.score) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-yellow-400";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {password && (
        <>
          <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={`h-full transition-all duration-300 ${
                  index < strength.score ? getStrengthClass() : "bg-gray-300"
                }`}
                style={{ width: "25%" }}
              />
            ))}
          </div>
          
          <div className="text-xs">
            <p className={`text-sm ${
              strength.score > 2 ? "text-green-600 dark:text-green-400" : 
              strength.score > 0 ? "text-yellow-600 dark:text-yellow-400" : 
              "text-red-600 dark:text-red-400"
            }`}>
              {strength.feedback}
            </p>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className={`flex items-center space-x-1 ${strength.hasMinLength ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${strength.hasMinLength ? "bg-green-100 dark:bg-green-800" : "bg-gray-100 dark:bg-gray-800"}`}>
                  {strength.hasMinLength ? "✓" : "·"}
                </span>
                <span>8+ karaktè</span>
              </div>
              <div className={`flex items-center space-x-1 ${strength.hasUppercase ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${strength.hasUppercase ? "bg-green-100 dark:bg-green-800" : "bg-gray-100 dark:bg-gray-800"}`}>
                  {strength.hasUppercase ? "✓" : "·"}
                </span>
                <span>Lèt majiskil</span>
              </div>
              <div className={`flex items-center space-x-1 ${strength.hasNumber ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${strength.hasNumber ? "bg-green-100 dark:bg-green-800" : "bg-gray-100 dark:bg-gray-800"}`}>
                  {strength.hasNumber ? "✓" : "·"}
                </span>
                <span>Chif</span>
              </div>
              <div className={`flex items-center space-x-1 ${strength.hasSpecialChar ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${strength.hasSpecialChar ? "bg-green-100 dark:bg-green-800" : "bg-gray-100 dark:bg-gray-800"}`}>
                  {strength.hasSpecialChar ? "✓" : "·"}
                </span>
                <span>Karaktè espesyal</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
