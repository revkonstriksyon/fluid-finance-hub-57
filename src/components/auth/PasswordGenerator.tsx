
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { generatePasswordSuggestion } from "@/utils/passwordUtils";
import { Wand2 } from "lucide-react";

interface PasswordGeneratorProps {
  onPasswordGenerated: (password: string) => void;
  className?: string;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ 
  onPasswordGenerated,
  className = ""
}) => {
  const handleGeneratePassword = () => {
    const password = generatePasswordSuggestion();
    onPasswordGenerated(password);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={className}
            onClick={handleGeneratePassword}
          >
            <Wand2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Jenere yon modpas fò</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PasswordGenerator;
