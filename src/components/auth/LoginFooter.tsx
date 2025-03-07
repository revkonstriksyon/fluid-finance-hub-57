
import { Link } from "react-router-dom";
import { CardFooter } from "@/components/ui/card";

export const LoginFooter = () => {
  return (
    <CardFooter className="flex justify-center flex-col space-y-4">
      <div className="text-center text-sm">
        <Link to="/auth/reset-password" className="text-finance-blue hover:underline">
          Bliye modpas ou?
        </Link>
      </div>
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Pa gen yon kont? </span>
        <Link to="/auth/register" className="text-finance-blue hover:underline">
          Kreye yon kont
        </Link>
      </div>
    </CardFooter>
  );
};
