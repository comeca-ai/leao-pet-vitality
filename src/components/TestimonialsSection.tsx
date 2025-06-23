
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { useTestimonials } from "@/hooks/useTestimonials";

const TestimonialsSection = () => {
  const { data: testimonials, isLoading, error } = useTestimonials();

  if (isLoading) {
    return (
      <section id="depoimentos" className="py-16 md:py-24 bg-gradient-to-br from-cream-50 to-leaf-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-earth-600">Carregando depoimentos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Error loading testimonials:', error);
    return (
      <section id="depoimentos" className="py-16 md:py-24 bg-gradient-to-br from-cream-50 to-leaf-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-earth-600">Erro ao carregar depoimentos.</p>
          </div>
        </div>
      </section>
    );
  }

  // Fallback testimonials caso não haja dados no banco
  const fallbackTestimonials = [
    {
      id: '1',
      nome: "Maria Silva",
      texto: "Incrível! O Max estava com baixa imunidade e depois de 3 semanas usando o extrato, ele está muito mais disposto e saudável. Recomendo demais!",
      aprovado: true,
      destaque: true,
      data: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      foto_url: null
    },
    {
      id: '2',
      nome: "João Santos",
      texto: "A Luna é idosa e estava meio apática. Com o Juba de Leão, ela voltou a brincar e está mais alerta. O produto é excelente e entrega rápida.",
      aprovado: true,
      destaque: false,
      data: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      foto_url: null
    },
    {
      id: '3',
      nome: "Ana Costa",
      texto: "Uso para meus dois cachorros há 2 meses. A diferença é visível! Eles estão mais animados, com pelo mais bonito e sem problemas de saúde.",
      aprovado: true,
      destaque: true,
      data: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      foto_url: null
    }
  ];

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials;

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
          {displayTestimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="p-6 border-earth-200 hover:border-leaf-300 transition-all duration-300 hover:shadow-lg bg-white/80 backdrop-blur-sm"
            >
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-earth-700 leading-relaxed italic">
                  "{testimonial.texto}"
                </p>

                {/* User info */}
                <div className="flex items-center space-x-3 pt-2 border-t border-earth-100">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-earth-200 text-earth-700 text-sm font-medium">
                      {testimonial.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-earth-800 text-sm">
                      {testimonial.nome}
                    </p>
                    <p className="text-earth-500 text-xs">
                      {new Date(testimonial.data).toLocaleDateString('pt-BR')}
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
