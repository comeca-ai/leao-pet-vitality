
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ContactAddressForm from "@/components/checkout/ContactAddressForm";
import ProductSelector from "@/components/checkout/ProductSelector";
import StripeOrderSummary from "@/components/checkout/StripeOrderSummary";
import WhatsAppOption from "@/components/checkout/WhatsAppOption";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import LoadingOverlay from "@/components/checkout/LoadingOverlay";
import ProcessingStates from "@/components/checkout/ProcessingStates";
import FormValidationIndicator from "@/components/checkout/FormValidationIndicator";
import StepTransition from "@/components/checkout/StepTransition";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useProcessOrder } from "@/hooks/useProcessOrder";
import { useToast } from "@/hooks/use-toast";
import { useSendOrderEmail } from "@/hooks/useSendOrderEmail";

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [processingState, setProcessingState] = useState<'idle' | 'validating' | 'creating-order' | 'sending-email' | 'redirecting' | 'complete'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'whatsapp'>('stripe');
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

  const { mutate: createCheckout, isPending: isStripeLoading } = useStripeCheckout();
  const { mutate: processOrder, isPending: isOrderLoading } = useProcessOrder();
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

  const handleStripeCheckout = () => {
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

  const handleWhatsAppCheckout = () => {
    if (!isFormValid) {
      toast({
        title: "Dados obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      setCurrentStep(1);
      return;
    }

    processOrder({
      quantity,
      paymentMethod: 'whatsapp',
      customerInfo,
    }, {
      onSuccess: (data) => {
        if (data.whatsappLink) {
          toast({
            title: "Redirecionando para WhatsApp",
            description: "Você será direcionado para finalizar o pedido.",
          });
          
          setTimeout(() => {
            window.open(data.whatsappLink, '_blank');
          }, 1000);
        }
      },
      onError: (error) => {
        console.error('WhatsApp checkout error:', error);
        toast({
          title: "Erro no checkout",
          description: "Houve um erro ao processar seu pedido. Tente novamente.",
          variant: "destructive",
        });
      },
    });
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
              <div className="space-y-4">
                {/* Seletor de método de pagamento */}
                <div className="bg-white rounded-lg p-4 border border-earth-200">
                  <h3 className="font-semibold text-earth-800 mb-3">Escolha o método de pagamento:</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={paymentMethod === 'stripe'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'stripe')}
                        className="text-blue-600"
                      />
                      <span className="text-earth-700">Cartão de Crédito (Stripe)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="whatsapp"
                        checked={paymentMethod === 'whatsapp'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'whatsapp')}
                        className="text-green-600"
                      />
                      <span className="text-earth-700">WhatsApp</span>
                    </label>
                  </div>
                </div>

                {/* Renderizar opção selecionada */}
                {paymentMethod === 'stripe' ? (
                  <StripeOrderSummary
                    quantity={quantity}
                    productPrice={productPrice}
                    total={total}
                    onCheckout={handleStripeCheckout}
                    isLoading={isStripeLoading || isProcessing}
                    isFormValid={isFormValid}
                  />
                ) : (
                  <WhatsAppOption
                    quantity={quantity}
                    total={total}
                    onWhatsAppCheckout={handleWhatsAppCheckout}
                    isLoading={isOrderLoading}
                  />
                )}
              </div>
            </StepTransition>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
