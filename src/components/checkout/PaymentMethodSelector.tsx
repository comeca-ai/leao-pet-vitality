
import { Input } from "@/components/ui/input";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

const PaymentMethodSelector = ({ paymentMethod, onPaymentMethodChange }: PaymentMethodSelectorProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-earth-800 mb-4">
        3. Forma de pagamento
      </h2>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <input 
            type="radio" 
            id="cartao" 
            name="payment" 
            value="cartao" 
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="text-leaf-600" 
          />
          <label htmlFor="cartao" className="text-earth-800">Cartão</label>
        </div>
        <div className="flex items-center space-x-3">
          <input 
            type="radio" 
            id="pix" 
            name="payment" 
            value="pix" 
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="text-leaf-600" 
          />
          <label htmlFor="pix" className="text-earth-800">Pix</label>
        </div>
        <div className="flex items-center space-x-3">
          <input 
            type="radio" 
            id="boleto" 
            name="payment" 
            value="boleto" 
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="text-leaf-600" 
          />
          <label htmlFor="boleto" className="text-earth-800">Boleto</label>
        </div>
      </div>
      
      {paymentMethod && (
        <div className="mt-4">
          <Input placeholder="Dados do pagamento" className="border-earth-300" />
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
