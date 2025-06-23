
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Building, Hash } from "lucide-react";
import ContactFormField from "./ContactFormField";
import ContactFormNote from "./ContactFormNote";
import { validateField, formatField } from "./utils/validation";

interface ContactAddressFormProps {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      zipCode: string;
    };
  };
  onCustomerInfoChange: (info: ContactAddressFormProps['customerInfo']) => void;
}

const ContactAddressForm = ({ customerInfo, onCustomerInfoChange }: ContactAddressFormProps) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    // Format field value
    const formattedValue = formatField(field, value);

    const newCustomerInfo = { ...customerInfo };
    if (field === 'street' || field === 'city' || field === 'zipCode') {
      newCustomerInfo.address = { ...newCustomerInfo.address, [field]: formattedValue };
    } else {
      (newCustomerInfo as any)[field] = formattedValue;
    }

    onCustomerInfoChange(newCustomerInfo);

    // Validate field
    const error = validateField(field, formattedValue);
    setValidationErrors(prev => ({ ...prev, [field]: error }));
  };

  return (
    <Card className="border-earth-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-earth-50 to-leaf-50">
        <CardTitle className="text-earth-800 flex items-center gap-2">
          <User className="w-5 h-5" />
          Informações de Contato e Entrega
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <ContactFormField
            id="name"
            label="Nome completo"
            type="text"
            placeholder="Seu nome completo"
            value={customerInfo.name}
            onChange={(value) => handleInputChange('name', value)}
            required
            icon={User}
            validationError={validationErrors.name}
            isValid={validationErrors.name === '' && customerInfo.name.length > 0}
          />

          <ContactFormField
            id="email"
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={customerInfo.email}
            onChange={(value) => handleInputChange('email', value)}
            required
            icon={Mail}
            validationError={validationErrors.email}
            isValid={validationErrors.email === '' && customerInfo.email.length > 0}
          />

          <ContactFormField
            id="phone"
            label="Telefone/WhatsApp"
            type="tel"
            placeholder="(11) 99999-9999"
            value={customerInfo.phone}
            onChange={(value) => handleInputChange('phone', value)}
            required
            icon={Phone}
            validationError={validationErrors.phone}
            isValid={validationErrors.phone === '' && customerInfo.phone.length > 0}
          />

          <ContactFormField
            id="zipCode"
            label="CEP"
            type="text"
            placeholder="00000-000"
            value={customerInfo.address.zipCode}
            onChange={(value) => handleInputChange('zipCode', value)}
            icon={Hash}
            validationError={validationErrors.zipCode}
            isValid={customerInfo.address.zipCode.length === 0 || (customerInfo.address.zipCode.length === 9 && validationErrors.zipCode === '')}
          />

          <ContactFormField
            id="street"
            label="Endereço"
            type="text"
            placeholder="Rua, número, complemento"
            value={customerInfo.address.street}
            onChange={(value) => handleInputChange('street', value)}
            icon={MapPin}
            validationError=""
            isValid={true}
          />

          <ContactFormField
            id="city"
            label="Cidade"
            type="text"
            placeholder="Nome da cidade"
            value={customerInfo.address.city}
            onChange={(value) => handleInputChange('city', value)}
            icon={Building}
            validationError=""
            isValid={true}
          />
        </div>

        <ContactFormNote />
      </CardContent>
    </Card>
  );
};

export default ContactAddressForm;
