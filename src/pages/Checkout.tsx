
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ContactAddressForm from "@/components/checkout/ContactAddressForm";
import ProductSelector from "@/components/checkout/ProductSelector";
import StripeOrderSummary from "@/components/checkout/StripeOrderSummary";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      zipCode: "",
    },
  });

  const { mutate: createCheckout, isPending } = useStripeCheckout();
  const { toast } = useToast();
  const navigate = useNavigate();

  const productPrice = 49.90;
  const total = productPrice * quantity;

  const handleCheckout = () => {
    // Validate required fields
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Dados obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    createCheckout({
      quantity,
      customerInfo,
    }, {
      onSuccess: (data) => {
        console.log('Redirecting to Stripe checkout:', data.url);
        // Redirect to Stripe checkout
        window.location.href = data.url;
      },
      onError: (error) => {
        console.error('Checkout error:', error);
        toast({
          title: "Erro no checkout",
          description: "Houve um erro ao processar seu pedido. Tente novamente.",
          variant: "destructive",
        });
      },
    });
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
              <ContactAddressForm 
                customerInfo={customerInfo}
                onCustomerInfoChange={setCustomerInfo}
              />
              <ProductSelector 
                quantity={quantity} 
                onQuantityChange={setQuantity} 
                productPrice={productPrice}
              />
            </div>

            <StripeOrderSummary
              quantity={quantity}
              productPrice={productPrice}
              total={total}
              onCheckout={handleCheckout}
              isLoading={isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
