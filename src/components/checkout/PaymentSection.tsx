
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useProcessOrder } from "@/hooks/useProcessOrder";
import { useSendOrderEmail } from "@/hooks/useSendOrderEmail";
import { useNotifications } from "@/hooks/useNotifications";
import StripeOrderSummary from "./StripeOrderSummary";
import WhatsAppOption from "./WhatsAppOption";
import { CustomerInfo } from "@/hooks/useCheckout";

interface PaymentSectionProps {
  quantity: number;
  productPrice: number;
  total: number;
  paymentMethod: 'stripe' | 'whatsapp';
  setPaymentMethod: (method: 'stripe' | 'whatsapp') => void;
  customerInfo: CustomerInfo;
  mainProduct: any;
  isFormValid: boolean;
  stockValidation: any;
  processingState: string;
  setProcessingState: (state: any) => void;
  setPaymentError: (error: any) => void;
  validateBeforeCheckout: () => boolean;
}

const PaymentSection = ({
  quantity,
  productPrice,
  total,
  paymentMethod,
  setPaymentMethod,
  customerInfo,
  mainProduct,
  isFormValid,
  stockValidation,
  processingState,
  setProcessingState,
  setPaymentError,
  validateBeforeCheckout,
}: PaymentSectionProps) => {
  const notifications = useNotifications();
  const { mutate: createCheckout, isPending: isStripeLoading } = useStripeCheckout();
  const { mutate: processOrder, isPending: isOrderLoading } = useProcessOrder();
  const { mutate: sendOrderEmail } = useSendOrderEmail();

  const isProcessing = processingState !== 'idle';

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

  return (
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
          isFormValid={isFormValid && stockValidation.isAvailable && quantity > 0}
        />
      ) : (
        <WhatsAppOption
          quantity={quantity}
          total={total}
          onWhatsAppCheckout={handleWhatsAppCheckout}
          isLoading={isOrderLoading}
          isFormValid={isFormValid && stockValidation.isAvailable && quantity > 0}
        />
      )}
    </div>
  );
};

export default PaymentSection;
