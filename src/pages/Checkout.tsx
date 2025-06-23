
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  const productPrice = 89.90;
  const shipping = 0.00;
  const total = (productPrice * quantity) + shipping;

  const handleFinalizePedido = () => {
    navigate("/confirmacao");
  };

  const handleWhatsAppCheckout = () => {
    const message = `Olá! Gostaria de finalizar minha compra:
    
Produto: Juba de Leão para Pets
Quantidade: ${quantity}
Valor: R$ ${total.toFixed(2).replace('.', ',')}

Aguardo retorno para finalizar o pedido!`;
    
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-earth-800 mb-8 pb-2 border-b-2 border-earth-300">
            Checkout - Juba de Leão para Pets
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulário Principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* 1. Dados de contato e endereço */}
              <div>
                <h2 className="text-xl font-semibold text-earth-800 mb-4">
                  1. Dados de contato e endereço
                </h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input placeholder="Nome completo" className="border-earth-300" />
                    </div>
                    <div>
                      <Input placeholder="Telefone" className="border-earth-300" />
                    </div>
                  </div>
                  <div>
                    <Input placeholder="E-mail" className="border-earth-300" />
                  </div>
                  <div>
                    <Input placeholder="Endereço" className="border-earth-300" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input placeholder="Cidade" className="border-earth-300" />
                    </div>
                    <div>
                      <Input placeholder="CEP" className="border-earth-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Produto e quantidade */}
              <div>
                <h2 className="text-xl font-semibold text-earth-800 mb-4">
                  2. Produto e quantidade
                </h2>
                <div className="flex items-start gap-6">
                  <div className="bg-gradient-to-br from-earth-200 to-leaf-200 rounded-xl p-4 w-24 h-32 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-12 bg-earth-500 rounded-lg mx-auto mb-1 shadow-lg"></div>
                      <p className="text-earth-700 font-medium text-xs">Juba de Leão</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-earth-800 font-medium mb-2">Juba de Leão para Pets</p>
                    <div className="flex items-center gap-3">
                      <Label className="text-earth-700">Quantidade:</Label>
                      <Input 
                        type="number" 
                        min="1" 
                        value={quantity} 
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-20 border-earth-300" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Forma de pagamento */}
              <div>
                <h2 className="text-xl font-semibold text-earth-800 mb-4">
                  3. Forma de pagamento
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input 
                      type="radio" 
                      id="cartao" 
                      name="payment" 
                      value="cartao" 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-leaf-600" 
                    />
                    <label htmlFor="cartao" className="text-earth-800">Cartão</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="radio" 
                      id="pix" 
                      name="payment" 
                      value="pix" 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-leaf-600" 
                    />
                    <label htmlFor="pix" className="text-earth-800">Pix</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="radio" 
                      id="boleto" 
                      name="payment" 
                      value="boleto" 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-leaf-600" 
                    />
                    <label htmlFor="boleto" className="text-earth-800">Boleto</label>
                  </div>
                </div>
                
                {paymentMethod && (
                  <div className="mt-4">
                    <Input placeholder="Dados do pagamento" className="border-earth-300" />
                  </div>
                )}
              </div>
            </div>

            {/* 4. Resumo do pedido */}
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
                      onClick={handleFinalizePedido}
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
                      onClick={handleWhatsAppCheckout}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Falar no WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
