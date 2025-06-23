
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Building, Hash } from "lucide-react";
import FormValidationFeedback from "./FormValidationFeedback";

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

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        return value.length >= 2 ? '' : 'Nome deve ter pelo menos 2 caracteres';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'E-mail inválido';
      case 'phone':
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return phoneRegex.test(value) ? '' : 'Telefone inválido';
      case 'zipCode':
        const zipRegex = /^\d{5}-\d{3}$/;
        return zipRegex.test(value) ? '' : 'CEP inválido';
      default:
        return '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Format phone number
    if (field === 'phone') {
      value = value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
      }
    }

    // Format ZIP code
    if (field === 'zipCode') {
      value = value.replace(/\D/g, '');
      if (value.length <= 8) {
        value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
      }
    }

    const newCustomerInfo = { ...customerInfo };
    if (field === 'street' || field === 'city' || field === 'zipCode') {
      newCustomerInfo.address = { ...newCustomerInfo.address, [field]: value };
    } else {
      (newCustomerInfo as any)[field] = value;
    }

    onCustomerInfoChange(newCustomerInfo);

    // Validate field
    const error = validateField(field, value);
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
          <div className="space-y-2">
            <Label htmlFor="name" className="text-earth-700 font-medium">
              Nome completo *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-earth-400" />
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={customerInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="pl-10 border-earth-200 focus:border-leaf-400"
                required
              />
            </div>
            <FormValidationFeedback 
              isValid={!validationErrors.name && customerInfo.name.length > 0}
              message={validationErrors.name}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-earth-700 font-medium">
              E-mail *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-earth-400" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={customerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10 border-earth-200 focus:border-leaf-400"
                required
              />
            </div>
            <FormValidationFeedback 
              isValid={!validationErrors.email && customerInfo.email.length > 0}
              message={validationErrors.email}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-earth-700 font-medium">
              Telefone/WhatsApp *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-earth-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="pl-10 border-earth-200 focus:border-leaf-400"
                required
              />
            </div>
            <FormValidationFeedback 
              isValid={!validationErrors.phone && customerInfo.phone.length > 0}
              message={validationErrors.phone}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode" className="text-earth-700 font-medium">
              CEP
            </Label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 w-4 h-4 text-earth-400" />
              <Input
                id="zipCode"
                type="text"
                placeholder="00000-000"
                value={customerInfo.address.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className="pl-10 border-earth-200 focus:border-leaf-400"
              />
            </div>
            <FormValidationFeedback 
              isValid={!validationErrors.zipCode && customerInfo.address.zipCode.length === 0}
              message={validationErrors.zipCode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street" className="text-earth-700 font-medium">
              Endereço
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-earth-400" />
              <Input
                id="street"
                type="text"
                placeholder="Rua, número, complemento"
                value={customerInfo.address.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                className="pl-10 border-earth-200 focus:border-leaf-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-earth-700 font-medium">
              Cidade
            </Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 w-4 h-4 text-earth-400" />
              <Input
                id="city"
                type="text"
                placeholder="Nome da cidade"
                value={customerInfo.address.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="pl-10 border-earth-200 focus:border-leaf-400"
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Os campos marcados com * são obrigatórios. 
            O endereço é opcional mas recomendado para melhor experiência de entrega.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactAddressForm;
