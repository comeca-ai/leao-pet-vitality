
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import ContactAddressForm from "@/components/checkout/ContactAddressForm";
import ProcessingStates from "@/components/checkout/ProcessingStates";
import StepTransition from "@/components/checkout/StepTransition";
import FormValidationIndicator from "@/components/checkout/FormValidationIndicator";
import ProductSelector from "@/components/checkout/ProductSelector";
import PaymentSection from "@/components/checkout/PaymentSection";
import CheckoutStatus from "@/components/checkout/CheckoutStatus";
import LoadingOverlay from "@/components/checkout/LoadingOverlay";
import { useCheckout } from "@/hooks/useCheckout";

const Checkout = () => {
  const navigate = useNavigate();
  const {
    // Estado
    user,
    loading,
    quantity,
    currentStep,
    processingState,
    paymentMethod,
    paymentError,
    customerInfo,
    
    // Dados computados
    isLoadingProducts,
    productsError,
    mainProduct,
    productPrice,
    total,
    isFormValid,
    stockValidation,
    stockData,
    
    // Setters
    setCurrentStep,
    setProcessingState,
    setPaymentMethod,
    setPaymentError,
    
    // Handlers
    handleCustomerInfoChange,
    handleQuantityChange,
    validateBeforeCheckout,
    refetchStock,
  } = useCheckout();

  useEffect(() => {
    // Se não está carregando e não há usuário autenticado
    if (!loading && !user) {
      navigate("/login?redirect=/checkout");
    }
  }, [user, loading, navigate]);

  const handleRetryPayment = () => {
    setPaymentError(null);
    refetchStock(); // Revalidar estoque
  };

  const handleGoBack = () => {
    setPaymentError(null);
    setCurrentStep(1);
  };

  const isProcessing = processingState !== 'idle';

  // Verificar se deve mostrar telas de status (loading, erro, etc.)
  const statusComponent = (
    <CheckoutStatus
      isLoadingProducts={isLoadingProducts}
      productsError={productsError}
      mainProduct={mainProduct}
      paymentError={paymentError}
      loading={loading}
      onRetryPayment={handleRetryPayment}
      onGoBack={handleGoBack}
    />
  );

  // Se o componente de status retorna algo, renderizar isso
  if (isLoadingProducts || productsError || !mainProduct || paymentError || loading) {
    return statusComponent;
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
          {!stockValidation.isAvailable && quantity > 0 && (
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
              <PaymentSection
                quantity={quantity}
                productPrice={productPrice}
                total={total}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                customerInfo={customerInfo}
                mainProduct={mainProduct}
                isFormValid={isFormValid}
                stockValidation={stockValidation}
                processingState={processingState}
                setProcessingState={setProcessingState}
                setPaymentError={setPaymentError}
                validateBeforeCheckout={validateBeforeCheckout}
              />
            </StepTransition>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
