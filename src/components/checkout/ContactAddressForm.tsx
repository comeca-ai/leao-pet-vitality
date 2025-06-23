
import { Input } from "@/components/ui/input";

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
}

interface ContactAddressFormProps {
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (info: CustomerInfo) => void;
}

const ContactAddressForm = ({ customerInfo, onCustomerInfoChange }: ContactAddressFormProps) => {
  const updateCustomerInfo = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      onCustomerInfoChange({
        ...customerInfo,
        address: {
          ...customerInfo.address,
          [addressField]: value,
        },
      });
    } else {
      onCustomerInfoChange({
        ...customerInfo,
        [field]: value,
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-earth-800 mb-4">
        1. Dados de contato e endereço
      </h2>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Input 
              placeholder="Nome completo *" 
              className="border-earth-300"
              value={customerInfo.name}
              onChange={(e) => updateCustomerInfo('name', e.target.value)}
              required
            />
          </div>
          <div>
            <Input 
              placeholder="Telefone *" 
              className="border-earth-300"
              value={customerInfo.phone}
              onChange={(e) => updateCustomerInfo('phone', e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <Input 
            placeholder="E-mail *" 
            className="border-earth-300"
            type="email"
            value={customerInfo.email}
            onChange={(e) => updateCustomerInfo('email', e.target.value)}
            required
          />
        </div>
        <div>
          <Input 
            placeholder="Endereço" 
            className="border-earth-300"
            value={customerInfo.address.street}
            onChange={(e) => updateCustomerInfo('address.street', e.target.value)}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Input 
              placeholder="Cidade" 
              className="border-earth-300"
              value={customerInfo.address.city}
              onChange={(e) => updateCustomerInfo('address.city', e.target.value)}
            />
          </div>
          <div>
            <Input 
              placeholder="CEP" 
              className="border-earth-300"
              value={customerInfo.address.zipCode}
              onChange={(e) => updateCustomerInfo('address.zipCode', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactAddressForm;
