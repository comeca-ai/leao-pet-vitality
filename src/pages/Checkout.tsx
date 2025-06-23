import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import ContactAddressForm from "@/components/checkout/ContactAddressForm";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import OrderSummary from "@/components/checkout/OrderSummary";
import WhatsAppOption from "@/components/checkout/WhatsAppOption";
import StripeOrderSummary from "@/components/checkout/StripeOrderSummary";
import PaymentErrorHandler from "@/components/checkout/PaymentErrorHandler";
import LoadingOverlay from "@/components/checkout/LoadingOverlay";
import ProcessingStates from "@/components/checkout/ProcessingStates";
import StepTransition from "@/components/checkout/StepTransition";
import FormValidationIndicator from "@/components/checkout/FormValidationIndicator";
import ProductSelector from "@/components/checkout/ProductSelector";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useProcessOrder } from "@/hooks/useProcessOrder";
import { useSendOrderEmail } from "@/hooks/useSendOrderEmail";
import { useProducts } from "@/hooks/useProducts";
import { useStockValidation, validateStockAvailability } from "@/hooks/useStockValidation";
import { validateCompleteAddress } from "@/components/checkout/utils/validation";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";

const Checkout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const { toast } = useToast();

  useEffect(() => {
    // Se não está carregando e não há usuário autenticado
    if (!loading && !user) {
      notifications.showError(
        "Acesso restrito",
        "Você precisa estar logado para finalizar sua compra."
      );
      navigate("/login?redirect=/checkout");
    }
  }, [user, loading, navigate, notifications]);

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

  // Buscar produtos do banco de dados
  const { data: products, isLoading: isLoadingProducts, error: productsError } = useProducts();

  // Usar o primeiro produto ativo ou fallback
  const mainProduct = products && products.length > 0 ? products[0] : null;
  const mainProductId = mainProduct?.id;

  const { data: stockData, refetch: refetchStock } = useStockValidation(mainProductId);

  const productPrice = mainProduct?.preco_promocional || mainProduct?.preco || 49.90;
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
    // Validar se há produto disponível
    if (!mainProduct) {
      notifications.showError(
        "Produto indisponível",
        "Nenhum produto está disponível no momento."
      );
      return false;
    }

    // Validar dados do formulário
    if (!isFormValid) {
      notifications.showValidationError(
        'Por favor, preencha todos os campos obrigatórios corretamente.'
      );
      setCurrentStep(1);
      return false;
    }

    // Validar estoque
    if (!stockValidation.isAvailable) {
      notifications.showStockError(mainProduct.nome);
      return false;
    }

    return true;
  };

  const handleStripeCheckout = () => {
    if (!validateBeforeCheckout()) return;

    const loadingId = 'checkout-process';
    notifications.showLoading(loadingId, 'Processando pedido', 'Criando sua sessão de pagamento...');

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
              name: mainProduct?.nome || "Extrato de Juba de Leão 30ml",
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
          
          notifications.hideLoading(loadingId);
          notifications.showOrderCreated(orderNumber);
          
          setTimeout(() => {
            window.location.href = data.url;
          }, 2000);
        },
        onError: (error: any) => {
          console.error('Checkout error:', error);
          setProcessingState('idle');
          notifications.hideLoading(loadingId);
          
          // Categorizar o erro usando o sistema de notificações
          if (error.message?.includes('network') || error.message?.includes('fetch')) {
            notifications.showNetworkError();
          } else if (error.message?.includes('stripe')) {
            notifications.showPaymentError("Erro no sistema de pagamento. Tente novamente em alguns minutos.");
          } else {
            notifications.showPaymentError();
          }
          
          setPaymentError({
            type: 'unknown',
            message: "Houve um erro ao processar seu pedido. Tente novamente.",
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
          notifications.showInfo(
            "Redirecionando para WhatsApp",
            "Você será direcionado para finalizar o pedido."
          );
          
          setTimeout(() => {
            window.open(data.whatsappLink, '_blank');
          }, 1000);
        }
      },
      onError: (error: any) => {
        console.error('WhatsApp checkout error:', error);
        
        notifications.showError(
          "Erro no WhatsApp",
          "Erro ao gerar link do WhatsApp. Tente novamente."
        );
        
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

  // Mostrar loading enquanto carrega produtos
  if (isLoadingProducts) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-leaf-600" />
            <p className="text-earth-600">Carregando produtos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar erro se não conseguir carregar produtos
  if (productsError || !mainProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-earth-800 mb-2">Produto Indisponível</h2>
            <p className="text-earth-600 mb-4">
              Não há produtos disponíveis no momento. Tente novamente mais tarde.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-leaf-600 hover:bg-leaf-700 text-white px-6 py-2 rounded-lg"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

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

  // Loading state enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-leaf-600" />
            <p className="text-earth-600">Verificando autenticação...</p>
          </div>
        </div>
      </div>
    );
  }

  // Se não há usuário após o loading, não renderiza nada (vai redirecionar)
  if (!user) {
    return null;
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
            Checkout - {mainProduct.nome}
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
