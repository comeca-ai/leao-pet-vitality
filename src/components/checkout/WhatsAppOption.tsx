
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Shield, Clock, AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface WhatsAppOptionProps {
  quantity: number;
  total: number;
  onWhatsAppCheckout: () => void;
  isLoading: boolean;
  isFormValid?: boolean;
}

const WhatsAppOption = ({ 
  quantity, 
  total, 
  onWhatsAppCheckout,
  isLoading,
  isFormValid = true
}: WhatsAppOptionProps) => {
  return (
    <div>
      <Card className="border-green-200 shadow-lg">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-earth-800 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            Finalizar via WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-earth-600">Juba de Leão para Pets x{quantity}</span>
              <span className="text-earth-800">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-earth-600">Frete</span>
              <span className="text-green-600">Grátis</span>
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

          <div className="bg-green-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-green-800">Como funciona:</h4>
            <div className="space-y-2 text-sm text-green-700">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <span>Clique no botão abaixo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <span>Você será direcionado para o WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <span>Confirme seu pedido com nossa equipe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                <span>Escolha a forma de pagamento (PIX, cartão ou boleto)</span>
              </div>
            </div>
          </div>

          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onWhatsAppCheckout}
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Gerando link...
              </div>
            ) : (
              <>
                <MessageCircle className="w-5 h-5 mr-2" />
                Continuar no WhatsApp
              </>
            )}
          </Button>
          
          <div className="space-y-2 text-sm text-earth-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Atendimento personalizado</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              <span>Resposta em até 5 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span>Tire suas dúvidas direto com especialistas</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppOption;
