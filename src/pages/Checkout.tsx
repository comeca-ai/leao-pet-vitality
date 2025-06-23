
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ContactAddressForm from "@/components/checkout/ContactAddressForm";
import ProductSelector from "@/components/checkout/ProductSelector";
import StripeOrderSummary from "@/components/checkout/StripeOrderSummary";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import LoadingOverlay from "@/components/checkout/LoadingOverlay";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useToast } from "@/hooks/use-toast";
import { useSendOrderEmail } from "@/hooks/useSendOrderEmail";

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
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
  const { mutate: sendOrderEmail } = useSendOrderEmail();
  const { toast } = useToast();
  const navigate = useNavigate();

  const productPrice = 49.90;
  const total = productPrice * quantity;

  // Validação de campo obrigatório
  const isFormValid = customerInfo.name && customerInfo.email && customerInfo.phone;

  const handleCustomerInfoChange = (info: typeof customerInfo) => {
    setCustomerInfo(info);
    // Avançar para próximo step quando informações estiverem completas
    if (info.name && info.email && info.phone && currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleQuantityChange = (qty: number) => {
    setQuantity(qty);
    // Avançar para próximo step quando quantidade estiver selecionada
    if (qty > 0 && currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleCheckout = () => {
    // Validate required fields
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Dados obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      setCurrentStep(1);
      return;
    }

    setIsProcessing(true);

    createCheckout({
      quantity,
      customerInfo,
    }, {
      onSuccess: (data) => {
        console.log('Redirecting to Stripe checkout:', data.url);
        
        // Send confirmation email before redirecting to payment
        sendOrderEmail({
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          orderNumber: data.sessionId.slice(-8).toUpperCase(),
          orderTotal: total,
          orderItems: [{
            name: "Extrato de Juba de Leão 30ml",
            quantity: quantity,
            price: productPrice,
          }],
          emailType: 'confirmation',
        }, {
          onSuccess: () => {
            console.log('Confirmation email sent successfully');
          },
          onError: (error) => {
            console.error('Failed to send confirmation email:', error);
            // Don't stop the checkout process if email fails
          }
        });
        
        // Show success message before redirect
        toast({
          title: "Pedido criado com sucesso!",
          description: "Redirecionando para o pagamento...",
        });
        
        // Redirect to Stripe checkout after a brief delay
        setTimeout(() => {
          window.location.href = data.url;
        }, 1500);
      },
      onError: (error) => {
        console.error('Checkout error:', error);
        setIsProcessing(false);
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
      
      <LoadingOverlay 
        isVisible={isProcessing} 
        message="Criando seu pedido..." 
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-earth-800 mb-8 pb-2 border-b-2 border-earth-300">
            Checkout - Juba de Leão para Pets
          </h1>

          <CheckoutProgress currentStep={currentStep} />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className={`transition-all duration-300 ${currentStep >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                <ContactAddressForm 
                  customerInfo={customerInfo}
                  onCustomerInfoChange={handleCustomerInfoChange}
                />
              </div>
              
              <div className={`transition-all duration-300 ${currentStep >= 2 ? 'opacity-100' : 'opacity-50'}`}>
                <ProductSelector 
                  quantity={quantity} 
                  onQuantityChange={handleQuantityChange} 
                  productPrice={productPrice}
                />
              </div>
            </div>

            <div className={`transition-all duration-300 ${currentStep >= 3 ? 'opacity-100' : 'opacity-50'}`}>
              <StripeOrderSummary
                quantity={quantity}
                productPrice={productPrice}
                total={total}
                onCheckout={handleCheckout}
                isLoading={isPending || isProcessing}
                isFormValid={isFormValid}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
