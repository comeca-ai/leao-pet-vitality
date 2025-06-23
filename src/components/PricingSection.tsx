
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "1 Unidade",
      subtitle: "Para experimentar",
      price: "49,90",
      originalPrice: "59,90",
      bottles: 1,
      duration: "30 dias",
      savings: null,
      popular: false,
      features: [
        "1 frasco de 30ml",
        "Duração de 30 dias",
        "Frete grátis",
        "Garantia de 30 dias",
        "Suporte por WhatsApp"
      ]
    },
    {
      name: "3 Unidades",
      subtitle: "Mais vendido",
      price: "134,70",
      originalPrice: "179,70",
      bottles: 3,
      duration: "90 dias",
      savings: "Economize R$ 45,00",
      popular: true,
      features: [
        "3 frascos de 30ml",
        "Duração de 90 dias",
        "Frete grátis",
        "Garantia de 30 dias",
        "Suporte por WhatsApp",
        "Desconto progressivo"
      ]
    },
    {
      name: "5 Unidades",
      subtitle: "Melhor custo-benefício",
      price: "199,60",
      originalPrice: "299,50",
      bottles: 5,
      duration: "150 dias",
      savings: "Economize R$ 99,90",
      popular: false,
      features: [
        "5 frascos de 30ml",
        "Duração de 150 dias",
        "Frete grátis",
        "Garantia de 30 dias",
        "Suporte por WhatsApp",
        "Maior desconto",
        "Brinde especial"
      ]
    }
  ];

  const handleBuyNow = (quantity: number) => {
    // Store quantity in localStorage and navigate to checkout
    localStorage.setItem('checkoutQuantity', quantity.toString());
    navigate('/checkout');
  };

  return (
    <section id="precos" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-leaf-100 text-leaf-700 border-leaf-300 px-4 py-2">
            Oferta Especial
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-earth-800">
            Escolha a melhor{" "}
            <span className="text-leaf-600">quantidade</span> para seu pet
          </h2>
          <p className="text-xl text-earth-600 max-w-3xl mx-auto">
            Quanto mais você cuida da saúde do seu pet, mais você economiza. 
            Todos os planos incluem frete grátis e garantia de satisfação.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-leaf-400 bg-gradient-to-br from-leaf-50 to-cream-50' 
                  : 'border-earth-200 hover:border-leaf-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-leaf-600 text-white px-4 py-2 shadow-lg">
                    <Crown className="w-4 h-4 mr-1" />
                    Mais Vendido
                  </Badge>
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-earth-800">{plan.name}</h3>
                  <p className="text-earth-600">{plan.subtitle}</p>
                </div>

                {/* Price */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-4xl font-bold text-earth-800">R$ {plan.price}</span>
                    <div className="text-right">
                      <div className="text-sm text-earth-500 line-through">R$ {plan.originalPrice}</div>
                      {plan.savings && (
                        <div className="text-xs text-leaf-600 font-medium">{plan.savings}</div>
                      )}
                    </div>
                  </div>
                  <p className="text-earth-600">Pagamento via Stripe</p>
                  <div className="bg-earth-100 rounded-lg p-2">
                    <p className="text-sm text-earth-700">
                      {plan.bottles} frasco{plan.bottles > 1 ? 's' : ''} • {plan.duration}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-leaf-600 flex-shrink-0" />
                      <span className="text-earth-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className={`w-full py-3 text-lg rounded-full transition-all duration-300 ${
                    plan.popular
                      ? 'bg-leaf-600 hover:bg-leaf-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-earth-600 hover:bg-earth-700 text-white'
                  }`}
                  onClick={() => handleBuyNow(plan.bottles)}
                >
                  Comprar Agora
                </Button>

                {/* Additional info */}
                <div className="text-center text-sm text-earth-500">
                  <p>✓ Frete grátis para todo Brasil</p>
                  <p>✓ Entrega em 3-7 dias úteis</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Payment methods and guarantees */}
        <div className="mt-16 bg-gradient-to-r from-cream-50 to-earth-50 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-earth-800">
                Formas de Pagamento
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <p className="font-medium text-earth-800">Stripe Checkout</p>
                  <p className="text-sm text-earth-600">Cartão, PIX e boleto</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-earth-800">
                Suas Garantias
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-earth-700">30 dias de garantia total</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-earth-700">Frete grátis em todo Brasil</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-earth-700">Pagamento 100% seguro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
