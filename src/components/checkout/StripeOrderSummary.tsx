
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Shield, Truck, AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface StripeOrderSummaryProps {
  quantity: number;
  productPrice: number;
  total: number;
  onCheckout: () => void;
  isLoading: boolean;
  isFormValid?: boolean;
}

const StripeOrderSummary = ({ 
  quantity, 
  productPrice, 
  total, 
  onCheckout,
  isLoading,
  isFormValid = true
}: StripeOrderSummaryProps) => {
  return (
    <div>
      <Card className="border-earth-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-earth-800">Resumo do pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-earth-600">Juba de Leão para Pets x{quantity}</span>
              <span className="text-earth-800">R$ {(productPrice * quantity).toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-earth-600">Frete</span>
              <span className="text-earth-800 text-green-600">Grátis</span>
            </div>
            
            <Separator className="bg-earth-200" />
            
            <div className="flex justify-between text-lg font-bold">
              <span className="text-earth-800">Total</span>
              <span className="text-earth-800">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {!isFormValid && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800">
                Complete seus dados para continuar
              </span>
            </div>
          )}

          <div className="space-y-4 pt-4">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onCheckout}
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Processando...
                </div>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Finalizar com Stripe
                </>
              )}
            </Button>
            
            <div className="space-y-2 text-sm text-earth-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Pagamento 100% seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-green-600" />
                <span>Frete grátis para todo Brasil</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-green-600" />
                <span>Cartão, PIX e boleto</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StripeOrderSummary;
