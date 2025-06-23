
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Shield, Star, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";

const PricingSection = () => {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <section id="precos" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-earth-600">Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Error loading products:', error);
    return (
      <section id="precos" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-earth-600">Erro ao carregar produtos.</p>
          </div>
        </div>
      </section>
    );
  }

  // Fallback product caso não haja dados no banco
  const fallbackProduct = {
    id: '1',
    nome: "Extrato de Juba de Leão para Pets",
    descricao: "Suplemento natural que fortalece o sistema imunológico do seu pet, promovendo mais energia, vitalidade e bem-estar geral.",
    preco: 89.90,
    preco_promocional: 49.90,
    imagem_url: null,
    estoque: 100,
    ativo: true,
    stripe_product_id: null,
    stripe_price_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const mainProduct = products && products.length > 0 ? products[0] : fallbackProduct;
  const originalPrice = mainProduct.preco;
  const salePrice = mainProduct.preco_promocional || mainProduct.preco;
  const discount = mainProduct.preco_promocional 
    ? Math.round(((originalPrice - mainProduct.preco_promocional) / originalPrice) * 100)
    : 0;

  const benefits = [
    "Aprovado pelo MAPA",
    "30 dias de garantia",
    "Frete grátis para todo Brasil",
    "Reforça a imunidade",
    "Melhora a cognição",
    "100% natural e seguro",
    "Suporte via WhatsApp",
    "Resultados em 2-4 semanas"
  ];

  return (
    <section id="precos" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-leaf-100 text-leaf-700 border-leaf-300 px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Aprovado pelo MAPA
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-earth-800">
            Invista na saúde do seu{" "}
            <span className="text-leaf-600">pet</span>
          </h2>
          <p className="text-xl text-earth-600 max-w-3xl mx-auto">
            Único extrato de Juba de Leão para pets com aprovação oficial do MAPA. 
            Mais saúde, bem-estar e vitalidade para seu companheiro.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="p-8 border-2 border-leaf-300 relative overflow-hidden bg-gradient-to-br from-white to-cream-50">
            {/* Discount badge */}
            {discount > 0 && (
              <div className="absolute -top-4 -right-4 bg-red-500 text-white px-6 py-2 rounded-full transform rotate-12 font-bold text-sm">
                -{discount}%
              </div>
            )}

            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-earth-800">{mainProduct.nome}</h3>
                <p className="text-earth-600">{mainProduct.descricao}</p>
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                {discount > 0 && (
                  <div className="text-earth-500 text-lg line-through">
                    De R$ {originalPrice.toFixed(2).replace('.', ',')}
                  </div>
                )}
                <div className="text-4xl font-bold text-leaf-600">
                  R$ {salePrice.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-earth-600">
                  ou 3x de R$ {(salePrice / 3).toFixed(2).replace('.', ',')} sem juros
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 text-left">
                    <Check className="w-5 h-5 text-leaf-600 flex-shrink-0" />
                    <span className="text-earth-700">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="space-y-4">
                <Link to="/cadastro">
                  <Button 
                    size="lg" 
                    className="w-full bg-leaf-600 hover:bg-leaf-700 text-white py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Truck className="w-5 h-5 mr-2" />
                    Comprar Agora – Frete Grátis
                  </Button>
                </Link>
                
                <div className="flex items-center justify-center space-x-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="ml-2 text-earth-600 text-sm">4.9/5 (127 avaliações)</span>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="bg-cream-50 rounded-xl p-4 space-y-2">
                <div className="text-earth-800 font-semibold">🔒 Compra 100% Segura</div>
                <div className="text-earth-600 text-sm">
                  Pagamento protegido por SSL e garantia de 30 dias
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional trust section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="w-16 h-16 bg-leaf-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-leaf-600" />
            </div>
            <h4 className="font-semibold text-earth-800">Aprovado pelo MAPA</h4>
            <p className="text-earth-600 text-sm">Único produto com aprovação oficial</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-16 h-16 bg-leaf-100 rounded-full flex items-center justify-center mx-auto">
              <Truck className="w-8 h-8 text-leaf-600" />
            </div>
            <h4 className="font-semibold text-earth-800">Frete Grátis</h4>
            <p className="text-earth-600 text-sm">Entrega gratuita para todo o Brasil</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-16 h-16 bg-leaf-100 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-8 h-8 text-leaf-600" />
            </div>
            <h4 className="font-semibold text-earth-800">30 Dias de Garantia</h4>
            <p className="text-earth-600 text-sm">Satisfação garantida ou seu dinheiro de volta</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
