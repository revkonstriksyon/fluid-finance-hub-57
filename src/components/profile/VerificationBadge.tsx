
import { Shield, CheckCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VerificationBadgeProps {
  isVerified: boolean;
  verifiedDate?: string;
  verifiedType?: 'email' | 'phone' | 'id' | 'multiple';
}

const VerificationBadge = ({ 
  isVerified, 
  verifiedDate, 
  verifiedType = 'multiple' 
}: VerificationBadgeProps) => {
  if (!isVerified) return null;
  
  const formattedDate = verifiedDate 
    ? new Date(verifiedDate).toLocaleDateString('fr-FR')
    : '';

  const typeText = {
    'email': 'Imel Verifye',
    'phone': 'Telefòn Verifye',
    'id': 'Idantite Verifye',
    'multiple': 'Kont Verifye'
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="secondary" 
            className="ml-2 bg-finance-blue/10 text-finance-blue hover:bg-finance-blue/20"
          >
            {verifiedType === 'email' ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <Shield className="h-3 w-3 mr-1" />
            )}
            {typeText[verifiedType]}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Verifye depi {formattedDate || 'disponib'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VerificationBadge;
