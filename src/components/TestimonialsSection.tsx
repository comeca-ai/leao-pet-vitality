
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Maria Silva",
      location: "São Paulo, SP",
      petName: "Max",
      petType: "Golden Retriever",
      rating: 5,
      text: "Incrível! O Max estava com baixa imunidade e depois de 3 semanas usando o extrato, ele está muito mais disposto e saudável. Recomendo demais!",
      initial: "MS"
    },
    {
      name: "João Santos",
      location: "Rio de Janeiro, RJ", 
      petName: "Luna",
      petType: "Gata Persa",
      rating: 5,
      text: "A Luna é idosa e estava meio apática. Com o Juba de Leão, ela voltou a brincar e está mais alerta. O produto é excelente e entrega rápida.",
      initial: "JS"
    },
    {
      name: "Ana Costa",
      location: "Belo Horizonte, MG",
      petName: "Bob e Mel",
      petType: "SRD",
      rating: 5,
      text: "Uso para meus dois cachorros há 2 meses. A diferença é visível! Eles estão mais animados, com pelo mais bonito e sem problemas de saúde.",
      initial: "AC"
    },
    {
      name: "Pedro Oliveira",
      location: "Curitiba, PR",
      petName: "Mimi",
      petType: "Gata Siamesa",
      rating: 5,
      text: "Veterinário recomendou para a cognição da Mimi. Ela está mais ativa e interativa. Produto de qualidade com aprovação MAPA me dá segurança.",
      initial: "PO"
    },
    {
      name: "Carla Ferreira",
      location: "Salvador, BA",
      petName: "Thor",
      petType: "Pastor Alemão",
      rating: 5,
      text: "Thor estava com problemas imunológicos. Após 1 mês usando, os exames melhoraram muito! É impressionante a eficácia do produto.",
      initial: "CF"
    },
    {
      name: "Roberto Lima",
      location: "Fortaleza, CE",
      petName: "Princesa",
      petType: "Poodle",
      rating: 5,
      text: "A Princesa tem 12 anos e estava bem debilitada. Com o extrato, ela rejuvenesceu! Mais energia, apetite e disposição para passear.",
      initial: "RL"
    }
  ];

  return (
    <section id="depoimentos" className="py-16 md:py-24 bg-gradient-to-br from-cream-50 to-leaf-50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-earth-800">
            O que os tutores dizem sobre nosso{" "}
            <span className="text-leaf-600">produto</span>
          </h2>
          <p className="text-xl text-earth-600 max-w-3xl mx-auto">
            Mais de 1000 pets já foram beneficiados com nosso Extrato de Juba de Leão. 
            Veja os depoimentos reais de tutores satisfeitos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="p-6 border-earth-200 hover:border-leaf-300 transition-all duration-300 hover:shadow-lg bg-white/80 backdrop-blur-sm"
            >
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-earth-700 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                {/* Pet info */}
                <div className="bg-leaf-50 rounded-lg p-3">
                  <p className="text-sm text-leaf-700 font-medium">
                    Pet: {testimonial.petName} ({testimonial.petType})
                  </p>
                </div>

                {/* User info */}
                <div className="flex items-center space-x-3 pt-2 border-t border-earth-100">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-earth-200 text-earth-700 text-sm font-medium">
                      {testimonial.initial}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-earth-800 text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-earth-500 text-xs">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust section */}
        <div className="mt-16 bg-white rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="text-center space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-earth-800">
              Garantia de Satisfação de 30 Dias
            </h3>
            <p className="text-earth-600 max-w-2xl mx-auto">
              Estamos tão confiantes na qualidade do nosso produto que oferecemos 
              garantia total. Se não ficar satisfeito, devolvemos seu dinheiro.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-leaf-600">1000+</div>
                <div className="text-earth-600 text-sm">Pets Beneficiados</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-leaf-600">4.9/5</div>
                <div className="text-earth-600 text-sm">Avaliação Média</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-leaf-600">98%</div>
                <div className="text-earth-600 text-sm">Satisfação</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-leaf-600">30</div>
                <div className="text-earth-600 text-sm">Dias de Garantia</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
