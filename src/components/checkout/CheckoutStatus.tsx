
import { Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PaymentErrorHandler from "./PaymentErrorHandler";

interface CheckoutStatusProps {
  isLoadingProducts: boolean;
  productsError: any;
  mainProduct: any;
  paymentError: any;
  loading: boolean;
  onRetryPayment: () => void;
  onGoBack: () => void;
}

const CheckoutStatus = ({
  isLoadingProducts,
  productsError,
  mainProduct,
  paymentError,
  loading,
  onRetryPayment,
  onGoBack,
}: CheckoutStatusProps) => {
  const navigate = useNavigate();

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
                onRetry={onRetryPayment}
                onGoBack={onGoBack}
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

  // Se chegou até aqui, não deve mostrar nenhuma tela de status
  return null;
};

export default CheckoutStatus;
