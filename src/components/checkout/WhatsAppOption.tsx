
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Clock, Phone } from "lucide-react";

interface WhatsAppOptionProps {
  quantity: number;
  total: number;
  onWhatsAppCheckout: () => void;
  isLoading?: boolean;
}

const WhatsAppOption = ({ quantity, total, onWhatsAppCheckout, isLoading }: WhatsAppOptionProps) => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comprar via WhatsApp
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-green-700">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Atendimento instantâneo</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>Tire suas dúvidas antes de comprar</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-green-200">
          <div className="flex justify-between mb-2">
            <span className="text-green-700">Juba de Leão x{quantity}</span>
            <span className="font-medium text-green-800">R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="text-xs text-green-600">Frete grátis • Desconto à vista</div>
        </div>

        <Button 
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          onClick={onWhatsAppCheckout}
          disabled={isLoading}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {isLoading ? 'Processando...' : 'Continuar no WhatsApp'}
        </Button>

        <p className="text-xs text-green-600 text-center">
          Você será direcionado para o WhatsApp com todos os dados preenchidos
        </p>
      </CardContent>
    </Card>
  );
};

export default WhatsAppOption;
