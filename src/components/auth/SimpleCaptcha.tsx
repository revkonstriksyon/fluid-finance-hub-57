
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

interface SimpleCaptchaProps {
  onVerify: (verified: boolean) => void;
  className?: string;
}

const SimpleCaptcha = ({ onVerify, className = "" }: SimpleCaptchaProps) => {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(captcha);
    setUserInput("");
    setIsVerified(false);
    setError(null);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    setError(null);
  };

  const handleVerify = () => {
    if (userInput === captchaText) {
      setIsVerified(true);
      setError(null);
      onVerify(true);
    } else {
      setError("Kòd la pa kòrèk. Tanpri eseye ankò.");
      generateCaptcha();
      onVerify(false);
    }
  };

  const handleRefresh = () => {
    generateCaptcha();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label>Verifikasyon Captcha</Label>
        <div className="flex">
          <div className="relative flex-1">
            <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded text-center font-mono tracking-widest select-none text-gray-800 dark:text-gray-200 h-12 flex items-center justify-center">
              {captchaText.split("").map((char, i) => (
                <span 
                  key={i} 
                  style={{ 
                    transform: `rotate(${Math.random() * 20 - 10}deg)`,
                    display: 'inline-block',
                    marginLeft: '2px',
                    marginRight: '2px'
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            className="ml-2" 
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex">
          <Input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Antre kòd la"
            className="flex-1"
          />
          <Button 
            type="button" 
            className="ml-2" 
            onClick={handleVerify}
            disabled={isVerified}
          >
            Verifye
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
        
        {isVerified && (
          <p className="text-sm text-green-500 dark:text-green-400">Verifikasyon reyisi!</p>
        )}
      </div>
    </div>
  );
};

export default SimpleCaptcha;
