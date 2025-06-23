
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Brain, Heart, Shield, Sparkles } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Reforça a Imunidade",
      description: "Fortalece o sistema imunológico natural do seu pet, ajudando na prevenção de doenças e mantendo-o mais resistente.",
      highlight: "Aprovado pelo MAPA"
    },
    {
      icon: Brain,
      title: "Melhora a Cognição",
      description: "Contribui para o desenvolvimento e manutenção das funções cognitivas, especialmente em pets idosos.",
      highlight: "Função Cerebral"
    },
    {
      icon: Heart,
      title: "Bem-estar Geral",
      description: "Promove o bem-estar físico e emocional, aumentando a disposição e qualidade de vida do seu pet.",
      highlight: "Qualidade de Vida"
    },
    {
      icon: Sparkles,
      title: "Origem Natural",
      description: "Extrato puro de Juba de Leão (Hericium erinaceus), um cogumelo com propriedades medicinais comprovadas.",
      highlight: "100% Natural"
    }
  ];

  return (
    <section id="beneficios" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-leaf-100 text-leaf-700 border-leaf-300 px-4 py-2 text-sm">
            Benefícios Comprovados
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-earth-800">
            Por que escolher nosso{" "}
            <span className="text-leaf-600">Extrato de Juba de Leão?</span>
          </h2>
          <p className="text-xl text-earth-600 max-w-3xl mx-auto">
            Desenvolvido especificamente para pets, com aprovação do MAPA e 
            baseado em pesquisas científicas sobre os benefícios da Juba de Leão.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card 
              key={index}
              className="p-6 border-earth-200 hover:border-leaf-300 transition-all duration-300 hover:shadow-lg group cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-gradient-to-br from-leaf-100 to-earth-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-6 h-6 text-leaf-600" />
                  </div>
                  <Badge variant="secondary" className="bg-cream-100 text-earth-700 text-xs">
                    {benefit.highlight}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-semibold text-earth-800 group-hover:text-leaf-700 transition-colors">
                  {benefit.title}
                </h3>
                
                <p className="text-earth-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional info section */}
        <div className="mt-16 bg-gradient-to-r from-cream-50 to-leaf-50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-earth-800">
                Aprovação MAPA: Sua Garantia de Segurança
              </h3>
              <p className="text-earth-600 leading-relaxed">
                Nosso extrato é o único no mercado com aprovação oficial do 
                Ministério da Agricultura, Pecuária e Abastecimento (MAPA), 
                garantindo qualidade, segurança e eficácia para seu pet.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
                  <Shield className="w-8 h-8 text-leaf-600" />
                </div>
                <div>
                  <p className="font-semibold text-earth-800">Registro MAPA</p>
                  <p className="text-earth-600 text-sm">Produto aprovado e registrado</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold text-earth-800 mb-4">Composição Natural:</h4>
              <ul className="space-y-2 text-earth-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-leaf-500 rounded-full"></div>
                  <span>Extrato de Hericium erinaceus</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-leaf-500 rounded-full"></div>
                  <span>Sem aditivos químicos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-leaf-500 rounded-full"></div>
                  <span>Livre de conservantes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-leaf-500 rounded-full"></div>
                  <span>Seguro para cães e gatos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
