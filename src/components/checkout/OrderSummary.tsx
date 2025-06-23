
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageCircle } from "lucide-react";

interface OrderSummaryProps {
  quantity: number;
  productPrice: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  onFinalizePedido: () => void;
  onWhatsAppCheckout: () => void;
}

const OrderSummary = ({ 
  quantity, 
  productPrice, 
  shipping, 
  total, 
  paymentMethod, 
  onFinalizePedido, 
  onWhatsAppCheckout 
}: OrderSummaryProps) => {
  return (
    <div>
      <Card className="border-earth-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-earth-800">4. Resumo do pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-earth-600">Juba de Leão para Pets x{quantity}</span>
              <span className="text-earth-800">R$ {(productPrice * quantity).toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-earth-600">Frete</span>
              <span className="text-earth-800">R$ {shipping.toFixed(2).replace('.', ',')}</span>
            </div>
            
            <Separator className="bg-earth-200" />
            
            <div className="flex justify-between text-lg font-bold">
              <span className="text-earth-800">Total</span>
              <span className="text-earth-800">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Button 
              className="w-full bg-leaf-600 hover:bg-leaf-700 text-white py-3"
              disabled={!paymentMethod}
              onClick={onFinalizePedido}
            >
              Finalizar pedido
            </Button>
            
            <div className="flex items-center space-x-2 text-sm text-earth-600">
              <input type="checkbox" className="text-leaf-600" />
              <span>Falar no WhatsApp</span>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-earth-300 text-earth-700 hover:bg-earth-50"
              onClick={onWhatsAppCheckout}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Falar no WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;
