
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { useStockValidation, validateStockAvailability } from "@/hooks/useStockValidation";
import { validateCompleteAddress } from "@/components/checkout/utils/validation";
import { useNotifications } from "@/hooks/useNotifications";

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
}

export const useCheckout = () => {
  const { user, loading } = useAuth();
  const notifications = useNotifications();
  
  const [quantity, setQuantity] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [processingState, setProcessingState] = useState<'idle' | 'validating' | 'creating-order' | 'sending-email' | 'redirecting' | 'complete'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'whatsapp'>('stripe');
  const [paymentError, setPaymentError] = useState<any>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      zipCode: "",
    },
  });

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

  const handleCustomerInfoChange = (info: CustomerInfo) => {
    setCustomerInfo(info);
    setPaymentError(null);
    
    const validation = validateCompleteAddress(info);
    if (validation.isValid && currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleQuantityChange = (qty: number) => {
    setQuantity(qty);
    setPaymentError(null);
    
    // Verificar estoque imediatamente
    const validation = validateStockAvailability(stockData, qty);
    if (!validation.isAvailable && qty > 0) {
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

    // Validar quantidade
    if (quantity <= 0) {
      notifications.showValidationError(
        'Por favor, selecione uma quantidade maior que zero.'
      );
      setCurrentStep(2);
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

  return {
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
    products,
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
  };
};
