
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ContactAddressForm from "@/components/checkout/ContactAddressForm";
import ProductSelector from "@/components/checkout/ProductSelector";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import OrderSummary from "@/components/checkout/OrderSummary";

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  const productPrice = 89.90;
  const shipping = 0.00;
  const total = (productPrice * quantity) + shipping;

  const handleFinalizePedido = () => {
    navigate("/confirmacao");
  };

  const handleWhatsAppCheckout = () => {
    const message = `Olá! Gostaria de finalizar minha compra:
    
Produto: Juba de Leão para Pets
Quantidade: ${quantity}
Valor: R$ ${total.toFixed(2).replace('.', ',')}

Aguardo retorno para finalizar o pedido!`;
    
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-earth-800 mb-8 pb-2 border-b-2 border-earth-300">
            Checkout - Juba de Leão para Pets
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ContactAddressForm />
              <ProductSelector 
                quantity={quantity} 
                onQuantityChange={setQuantity} 
              />
              <PaymentMethodSelector 
                paymentMethod={paymentMethod} 
                onPaymentMethodChange={setPaymentMethod} 
              />
            </div>

            <OrderSummary
              quantity={quantity}
              productPrice={productPrice}
              shipping={shipping}
              total={total}
              paymentMethod={paymentMethod}
              onFinalizePedido={handleFinalizePedido}
              onWhatsAppCheckout={handleWhatsAppCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
