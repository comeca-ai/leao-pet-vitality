
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";
import FormValidationFeedback from "./FormValidationFeedback";

interface ContactFormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  icon: LucideIcon;
  validationError: string;
  isValid: boolean;
}

const ContactFormField = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  icon: Icon,
  validationError,
  isValid
}: ContactFormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-earth-700 font-medium">
        {label} {required && '*'}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 w-4 h-4 text-earth-400" />
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 border-earth-200 focus:border-leaf-400"
          required={required}
        />
      </div>
      <FormValidationFeedback 
        isValid={isValid}
        message={validationError}
      />
    </div>
  );
};

export default ContactFormField;
