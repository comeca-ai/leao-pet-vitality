
import { CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormValidationFeedbackProps {
  isValid: boolean;
  message?: string;
  className?: string;
}

const FormValidationFeedback = ({ isValid, message, className }: FormValidationFeedbackProps) => {
  if (!message) return null;

  return (
    <div className={cn(
      "flex items-center gap-2 text-sm mt-1",
      isValid ? "text-green-600" : "text-red-600",
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

export default FormValidationFeedback;
