
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, CreditCard, FileText, Zap, Truck, Shield } from "lucide-react";
import Header from "@/components/Header";

const Checkout = () => {
  const [selectedProduct, setSelectedProduct] = useState("30ml");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cep, setCep] = useState("");

  const products = {
    "30ml": { name: "Extrato de Juba de Leão 30ml", price: 89.90 },
    "60ml": { name: "Extrato de Juba de Leão 60ml", price: 149.90 },
    "combo": { name: "Combo 2x 30ml", price: 159.90 }
  };

  const currentProduct = products[selectedProduct as keyof typeof products];
  const subtotal = currentProduct.price * quantity;
  const frete = subtotal >= 150 ? 0 : 15.90;
  const total = subtotal + frete;

  const handleWhatsAppCheckout = () => {
    const message = `Olá! Gostaria de finalizar minha compra:
    
Produto: ${currentProduct.name}
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
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-earth-800 mb-2">
              Finalizar Compra
            </h1>
            <p className="text-earth-600">Complete seus dados para receber o produto</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulário Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Seção 1 - Dados de Contato e Endereço */}
              <Card className="border-earth-200 shadow-lg">
                <CardHeader className="bg-leaf-50 border-b border-leaf-200">
                  <CardTitle className="text-earth-800 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Dados de Contato e Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome" className="text-earth-700">Nome Completo *</Label>
                      <Input id="nome" placeholder="Seu nome completo" className="border-earth-300" />
                    </div>
                    <div>
                      <Label htmlFor="telefone" className="text-earth-700">Telefone (com DDD) *</Label>
                      <Input id="telefone" placeholder="(11) 99999-9999" className="border-earth-300" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cep" className="text-earth-700">CEP *</Label>
                      <Input 
                        id="cep" 
                        placeholder="00000-000" 
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        className="border-earth-300" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="cidade" className="text-earth-700">Cidade *</Label>
                      <Input id="cidade" placeholder="São Paulo" className="border-earth-300" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="endereco" className="text-earth-700">Endereço *</Label>
                      <Input id="endereco" placeholder="Rua, número" className="border-earth-300" />
                    </div>
                    <div>
                      <Label htmlFor="bairro" className="text-earth-700">Bairro *</Label>
                      <Input id="bairro" placeholder="Nome do bairro" className="border-earth-300" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="complemento" className="text-earth-700">Complemento</Label>
                      <Input id="complemento" placeholder="Apt, casa, etc." className="border-earth-300" />
                    </div>
                    <div>
                      <Label htmlFor="estado" className="text-earth-700">Estado *</Label>
                      <Select>
                        <SelectTrigger className="border-earth-300">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sp">São Paulo</SelectItem>
                          <SelectItem value="rj">Rio de Janeiro</SelectItem>
                          <SelectItem value="mg">Minas Gerais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seção 2 - Escolha do Produto */}
              <Card className="border-earth-200 shadow-lg">
                <CardHeader className="bg-leaf-50 border-b border-leaf-200">
                  <CardTitle className="text-earth-800 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Escolha do Produto
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-earth-700">Produto *</Label>
                        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                          <SelectTrigger className="border-earth-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30ml">Extrato de Juba de Leão 30ml - R$ 89,90</SelectItem>
                            <SelectItem value="60ml">Extrato de Juba de Leão 60ml - R$ 149,90</SelectItem>
                            <SelectItem value="combo">Combo 2x 30ml - R$ 159,90</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-earth-700">Quantidade *</Label>
                        <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                          <SelectTrigger className="border-earth-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4,5].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="bg-gradient-to-br from-earth-200 to-leaf-200 rounded-xl p-6 w-40 h-48 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-20 bg-earth-500 rounded-lg mx-auto mb-2 shadow-lg"></div>
                          <p className="text-earth-700 font-semibold text-sm">Juba de Leão</p>
                          <p className="text-earth-500 text-xs">{selectedProduct}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seção 3 - Formas de Pagamento */}
              <Card className="border-earth-200 shadow-lg">
                <CardHeader className="bg-leaf-50 border-b border-leaf-200">
                  <CardTitle className="text-earth-800 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Forma de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-3">
                    <label className="flex items-center space-x-3 p-4 border border-earth-300 rounded-lg hover:bg-leaf-50 cursor-pointer transition-colors">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="pix" 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-leaf-600" 
                      />
                      <Zap className="w-5 h-5 text-leaf-600" />
                      <div>
                        <span className="font-medium text-earth-800">PIX</span>
                        <p className="text-sm text-earth-600">Aprovação instantânea</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 p-4 border border-earth-300 rounded-lg hover:bg-leaf-50 cursor-pointer transition-colors">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="card" 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-leaf-600" 
                      />
                      <CreditCard className="w-5 h-5 text-leaf-600" />
                      <div>
                        <span className="font-medium text-earth-800">Cartão de Crédito</span>
                        <p className="text-sm text-earth-600">Parcelamento em até 12x</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 p-4 border border-earth-300 rounded-lg hover:bg-leaf-50 cursor-pointer transition-colors">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="boleto" 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-leaf-600" 
                      />
                      <FileText className="w-5 h-5 text-leaf-600" />
                      <div>
                        <span className="font-medium text-earth-800">Boleto Bancário</span>
                        <p className="text-sm text-earth-600">Vencimento em 3 dias úteis</p>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Resumo do Pedido */}
            <div className="space-y-6">
              <Card className="border-earth-200 shadow-lg sticky top-24">
                <CardHeader className="bg-leaf-50 border-b border-leaf-200">
                  <CardTitle className="text-earth-800">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-earth-200 to-leaf-200 rounded-xl p-4 w-32 h-36 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-16 bg-earth-500 rounded-lg mx-auto mb-2 shadow-lg"></div>
                        <p className="text-earth-700 font-semibold text-xs">Juba de Leão</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-earth-700">{currentProduct.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-earth-600">Quantidade:</span>
                      <span className="text-earth-800">{quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-earth-600">Preço unitário:</span>
                      <span className="text-earth-800">R$ {currentProduct.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    
                    <Separator className="bg-earth-200" />
                    
                    <div className="flex justify-between">
                      <span className="text-earth-600">Subtotal:</span>
                      <span className="text-earth-800">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-earth-600">Frete:</span>
                      <span className="text-earth-800">
                        {frete === 0 ? (
                          <Badge className="bg-leaf-100 text-leaf-700">Grátis</Badge>
                        ) : (
                          `R$ ${frete.toFixed(2).replace('.', ',')}`
                        )}
                      </span>
                    </div>
                    
                    <Separator className="bg-earth-200" />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-earth-800">Total:</span>
                      <span className="text-leaf-600">R$ {total.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button 
                      className="w-full bg-leaf-600 hover:bg-leaf-700 text-white py-3 rounded-full"
                      disabled={!paymentMethod}
                    >
                      Finalizar Compra
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-sm text-earth-600 mb-2">Ou finalize pelo WhatsApp</p>
                      <Button 
                        variant="outline" 
                        className="w-full border-earth-300 text-earth-700 hover:bg-earth-50 rounded-full"
                        onClick={handleWhatsAppCheckout}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Comprar pelo WhatsApp
                      </Button>
                    </div>
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
