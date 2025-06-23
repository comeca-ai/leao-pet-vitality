
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Truck, MessageCircle, Home, Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const Confirmacao = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!sessionId) {
        setPaymentStatus('error');
        setIsLoading(false);
        return;
      }

      try {
        // Simular verificação do pagamento
        // Em produção, isso seria uma chamada real para verificar o status no Stripe
        setTimeout(() => {
          const mockOrderDetails = {
            numero: sessionId.slice(-8).toUpperCase(),
            produto: "Extrato de Juba de Leão 30ml",
            quantidade: 1,
            preco: 49.90,
            frete: 0,
            total: 49.90,
            pagamento: "Cartão de Crédito",
            status: "Confirmado",
            dataCompra: new Date().toLocaleDateString('pt-BR'),
            estimativaEntrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
          };

          setOrderDetails(mockOrderDetails);
          setPaymentStatus('success');
          setIsLoading(false);

          toast({
            title: "Pagamento confirmado!",
            description: "Seu pedido foi processado com sucesso.",
          });
        }, 2000);
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('error');
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, [sessionId, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-earth-800 mb-2">
              Processando seu pagamento...
            </h1>
            <p className="text-xl text-earth-600">
              Aguarde um momento enquanto confirmamos seu pedido.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Erro no pagamento
            </h1>
            <p className="text-xl text-earth-600 mb-6">
              Houve um problema com seu pagamento. Tente novamente.
            </p>
            <Link to="/checkout">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Voltar ao Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return null;
  }

  const handleWhatsAppContact = () => {
    const message = `Olá! Tenho dúvidas sobre meu pedido #${orderDetails.numero}`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Mensagem de Sucesso */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-earth-800 mb-2">
              Pagamento Confirmado!
            </h1>
            <p className="text-xl text-earth-600 mb-2">
              Obrigado pela sua compra!
            </p>
            <Badge className="bg-green-100 text-green-700 px-4 py-2 text-base">
              Pedido #{orderDetails.numero}
            </Badge>
          </div>

          {/* Resumo do Pedido */}
          <Card className="border-earth-200 shadow-lg mb-6">
            <CardHeader className="bg-green-50 border-b border-green-200">
              <CardTitle className="text-earth-800 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Resumo do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Produto */}
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-br from-earth-200 to-leaf-200 rounded-xl p-4 w-32 h-36 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-16 bg-earth-500 rounded-lg mx-auto mb-2 shadow-lg"></div>
                        <p className="text-earth-700 font-semibold text-xs">Juba de Leão</p>
                        <p className="text-earth-500 text-xs">30ml</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detalhes */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-earth-600">Produto:</span>
                    <span className="text-earth-800 font-medium">{orderDetails.produto}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-earth-600">Quantidade:</span>
                    <span className="text-earth-800">{orderDetails.quantidade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-earth-600">Preço unitário:</span>
                    <span className="text-earth-800">R$ {orderDetails.preco.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-earth-600">Frete:</span>
                    <span className="text-earth-800">
                      <Badge className="bg-green-100 text-green-700">Grátis</Badge>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-earth-600">Forma de pagamento:</span>
                    <span className="text-earth-800">{orderDetails.pagamento}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-earth-600">Data da compra:</span>
                    <span className="text-earth-800">{orderDetails.dataCompra}</span>
                  </div>
                  
                  <Separator className="bg-earth-200" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-earth-800">Total:</span>
                    <span className="text-green-600">R$ {orderDetails.total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próximos Passos */}
          <Card className="border-earth-200 shadow-lg mb-6">
            <CardHeader className="bg-blue-50 border-b border-blue-200">
              <CardTitle className="text-earth-800 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Próximos Passos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-cream-50 rounded-lg">
                  <div className="w-8 h-8 bg-leaf-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-earth-800">Confirmação de Pagamento</h4>
                    <p className="text-earth-600 text-sm">
                      Você receberá um e-mail com os detalhes do pagamento em alguns minutos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-cream-50 rounded-lg">
                  <div className="w-8 h-8 bg-leaf-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-earth-800">Processamento do Pedido</h4>
                    <p className="text-earth-600 text-sm">
                      Após a confirmação do pagamento, seu pedido será processado em até 2 dias úteis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-cream-50 rounded-lg">
                  <div className="w-8 h-8 bg-leaf-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-earth-800">Envio e Entrega</h4>
                    <p className="text-earth-600 text-sm">
                      Você receberá o código de rastreamento e seu produto chegará em até {orderDetails.estimativaEntrega}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-earth-800 mb-2">Dúvidas ou Problemas?</h4>
                <p className="text-earth-600 text-sm mb-3">
                  Entre em contato conosco pelo WhatsApp para acompanhar seu pedido ou tirar dúvidas.
                </p>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleWhatsAppContact}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Falar no WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="outline" className="border-earth-300 text-earth-700 hover:bg-earth-50 px-8 py-3 rounded-full">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
            
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full"
              onClick={() => window.print()}
            >
              Imprimir Pedido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmacao;
