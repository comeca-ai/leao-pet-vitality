
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ContactAddressForm from "@/components/checkout/ContactAddressForm";
import ProductSelector from "@/components/checkout/ProductSelector";
import StripeOrderSummary from "@/components/checkout/StripeOrderSummary";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import LoadingOverlay from "@/components/checkout/LoadingOverlay";
import ProcessingStates from "@/components/checkout/ProcessingStates";
import FormValidationIndicator from "@/components/checkout/FormValidationIndicator";
import StepTransition from "@/components/checkout/StepTransition";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useToast } from "@/hooks/use-toast";
import { useSendOrderEmail } from "@/hooks/useSendOrderEmail";

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [processingState, setProcessingState] = useState<'idle' | 'validating' | 'creating-order' | 'sending-email' | 'redirecting' | 'complete'>('idle');
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

  const isFormValid = Boolean(
    customerInfo.name && 
    customerInfo.email && 
    customerInfo.phone &&
    customerInfo.address.city &&
    customerInfo.address.street
  );

  const handleCustomerInfoChange = (info: typeof customerInfo) => {
    setCustomerInfo(info);
    if (info.name && info.email && info.phone && currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleQuantityChange = (qty: number) => {
    setQuantity(qty);
    if (qty > 0 && currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleCheckout = () => {
    if (!isFormValid) {
      toast({
        title: "Dados obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      setCurrentStep(1);
      return;
    }

    setProcessingState('validating');

    setTimeout(() => {
      setProcessingState('creating-order');
      
      createCheckout({
        quantity,
        customerInfo,
      }, {
        onSuccess: (data) => {
          console.log('Redirecting to Stripe checkout:', data.url);
          setProcessingState('sending-email');
          
          // Gerar número do pedido baseado no sessionId
          const orderNumber = data.sessionId.slice(-8).toUpperCase();
          
          sendOrderEmail({
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            orderNumber: orderNumber,
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
              setProcessingState('redirecting');
            },
            onError: (error) => {
              console.error('Failed to send confirmation email:', error);
              setProcessingState('redirecting');
            }
          });
          
          toast({
            title: "Pedido criado com sucesso!",
            description: "Redirecionando para o pagamento...",
          });
          
          setTimeout(() => {
            window.location.href = data.url;
          }, 2000);
        },
        onError: (error) => {
          console.error('Checkout error:', error);
          setProcessingState('idle');
          toast({
            title: "Erro no checkout",
            description: "Houve um erro ao processar seu pedido. Tente novamente.",
            variant: "destructive",
          });
        },
      });
    }, 500);
  };

  const isProcessing = processingState !== 'idle';

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
      <Header />
      
      <LoadingOverlay 
        isVisible={isProcessing} 
        message="Processando seu pedido..." 
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-earth-800 mb-8 pb-2 border-b-2 border-earth-300">
            Checkout - Juba de Leão para Pets
          </h1>

          <CheckoutProgress currentStep={currentStep} />
          <ProcessingStates currentState={processingState} />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <StepTransition isActive={currentStep >= 1} isCompleted={currentStep > 1}>
                <ContactAddressForm 
                  customerInfo={customerInfo}
                  onCustomerInfoChange={handleCustomerInfoChange}
                />
                {currentStep >= 1 && (
                  <div className="mt-4">
                    <FormValidationIndicator
                      isValid={isFormValid}
                      message={isFormValid ? "Dados validados com sucesso" : "Complete os campos obrigatórios"}
                    />
                  </div>
                )}
              </StepTransition>
              
              <StepTransition isActive={currentStep >= 2} isCompleted={currentStep > 2}>
                <ProductSelector 
                  quantity={quantity} 
                  onQuantityChange={handleQuantityChange} 
                  productPrice={productPrice}
                />
              </StepTransition>
            </div>

            <StepTransition isActive={currentStep >= 3} isCompleted={false}>
              <StripeOrderSummary
                quantity={quantity}
                productPrice={productPrice}
                total={total}
                onCheckout={handleCheckout}
                isLoading={isPending || isProcessing}
                isFormValid={isFormValid}
              />
            </StepTransition>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
