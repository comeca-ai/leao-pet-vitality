import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
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
import PaymentErrorHandler from "@/components/checkout/PaymentErrorHandler";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useProcessOrder } from "@/hooks/useProcessOrder";
import { useStockValidation, validateStockAvailability } from "@/hooks/useStockValidation";
import { useToast } from "@/hooks/use-toast";
import { useSendOrderEmail } from "@/hooks/useSendOrderEmail";
import { validateCompleteAddress } from "@/components/checkout/utils/validation";

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [processingState, setProcessingState] = useState<'idle' | 'validating' | 'creating-order' | 'sending-email' | 'redirecting' | 'complete'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'whatsapp'>('stripe');
  const [paymentError, setPaymentError] = useState<any>(null);
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

  // Usar um product ID fixo para o produto principal
  const mainProductId = "123e4567-e89b-12d3-a456-426614174000";
  const { data: stockData, refetch: refetchStock } = useStockValidation(mainProductId);

  const productPrice = 49.90;
  const total = productPrice * quantity;

  // Validação completa do endereço
  const addressValidation = validateCompleteAddress(customerInfo);
  const isFormValid = addressValidation.isValid;

  // Validação de estoque
  const stockValidation = validateStockAvailability(stockData, quantity);

  const handleCustomerInfoChange = (info: typeof customerInfo) => {
    setCustomerInfo(info);
    setPaymentError(null); // Limpar erros ao alterar dados
    
    const validation = validateCompleteAddress(info);
    if (validation.isValid && currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleQuantityChange = (qty: number) => {
    setQuantity(qty);
    setPaymentError(null); // Limpar erros ao alterar quantidade
    
    // Verificar estoque imediatamente
    const validation = validateStockAvailability(stockData, qty);
    if (!validation.isAvailable) {
      setPaymentError({
        type: 'stock',
        message: validation.message
      });
      return;
    }
    
    if (qty > 0 && currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const validateBeforeCheckout = () => {
    // Validar dados do formulário
    if (!isFormValid) {
      setPaymentError({
        type: 'validation',
        message: 'Por favor, preencha todos os campos obrigatórios corretamente.',
        details: Object.values(addressValidation.errors).join(', ')
      });
      setCurrentStep(1);
      return false;
    }

    // Validar estoque
    if (!stockValidation.isAvailable) {
      setPaymentError({
        type: 'stock',
        message: stockValidation.message
      });
      return false;
    }

    return true;
  };

  const handleStripeCheckout = () => {
    if (!validateBeforeCheckout()) return;

    setProcessingState('validating');
    setPaymentError(null);

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
        onError: (error: any) => {
          console.error('Checkout error:', error);
          setProcessingState('idle');
          
          // Categorizar o erro
          let errorType = 'unknown';
          let errorMessage = "Houve um erro ao processar seu pedido. Tente novamente.";
          
          if (error.message?.includes('network') || error.message?.includes('fetch')) {
            errorType = 'network';
            errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
          } else if (error.message?.includes('stripe')) {
            errorType = 'stripe';
            errorMessage = "Erro no sistema de pagamento. Tente novamente em alguns minutos.";
          }
          
          setPaymentError({
            type: errorType,
            message: errorMessage,
            details: error.message
          });
        },
      });
    }, 500);
  };

  const handleWhatsAppCheckout = () => {
    if (!validateBeforeCheckout()) return;

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
      onError: (error: any) => {
        console.error('WhatsApp checkout error:', error);
        
        setPaymentError({
          type: 'unknown',
          message: "Erro ao gerar link do WhatsApp. Tente novamente.",
          details: error.message
        });
      },
    });
  };

  const handleRetryPayment = () => {
    setPaymentError(null);
    refetchStock(); // Revalidar estoque
  };

  const handleGoBack = () => {
    setPaymentError(null);
    setCurrentStep(1);
  };

  const isProcessing = processingState !== 'idle';

  // Mostrar erro de pagamento se houver
  if (paymentError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-earth-800 mb-8 pb-2 border-b-2 border-earth-300">
              Checkout - Juba de Leão para Pets
            </h1>
            
            <div className="flex justify-center items-center min-h-[400px]">
              <PaymentErrorHandler
                error={paymentError}
                onRetry={handleRetryPayment}
                onGoBack={handleGoBack}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Alerta de estoque se necessário */}
          {!stockValidation.isAvailable && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{stockValidation.message}</span>
              </div>
            </div>
          )}

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
                  maxQuantity={stockData?.estoque || 100}
                  stockMessage={stockValidation.message}
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
                    isFormValid={isFormValid && stockValidation.isAvailable}
                  />
                ) : (
                  <WhatsAppOption
                    quantity={quantity}
                    total={total}
                    onWhatsAppCheckout={handleWhatsAppCheckout}
                    isLoading={isOrderLoading}
                    isFormValid={isFormValid && stockValidation.isAvailable}
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
