
import { CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormValidationIndicatorProps {
  isValid: boolean;
  message: string;
  className?: string;
}

const FormValidationIndicator = ({ isValid, message, className }: FormValidationIndicatorProps) => {
  return (
    <div className={cn(
      "flex items-center gap-2 text-sm transition-all duration-300",
      isValid ? "text-green-600" : "text-orange-600",
      className
    )}>
      {isValid ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      <span>{message}</span>
    </div>
  );
};

export default FormValidationIndicator;
