
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFAQs } from "@/hooks/useFAQs";

const FAQSection = () => {
  const { data: faqs, isLoading, error } = useFAQs();

  if (isLoading) {
    return (
      <section id="faq" className="py-16 md:py-24 bg-gradient-to-br from-cream-50 to-leaf-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-earth-600">Carregando perguntas frequentes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Error loading FAQs:', error);
    return (
      <section id="faq" className="py-16 md:py-24 bg-gradient-to-br from-cream-50 to-leaf-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-earth-600">Erro ao carregar perguntas frequentes.</p>
          </div>
        </div>
      </section>
    );
  }

  // Fallback FAQs caso não haja dados no banco
  const fallbackFAQs = [
    {
      id: '1',
      pergunta: "O Extrato de Juba de Leão é seguro para meu pet?",
      resposta: "Sim, nosso produto é 100% seguro e aprovado pelo MAPA (Ministério da Agricultura, Pecuária e Abastecimento). É desenvolvido especificamente para pets, seguindo rigorosos padrões de qualidade e segurança. Recomendamos sempre consultar um veterinário antes de iniciar qualquer suplementação.",
      ordem: 1,
      ativo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      pergunta: "Em quanto tempo vou ver os resultados?",
      resposta: "Os primeiros sinais de melhora geralmente aparecem entre 2-4 semanas de uso contínuo. Para resultados mais significativos, recomendamos o uso por pelo menos 60-90 dias. Cada pet responde de forma diferente, mas a maioria dos tutores reporta melhorias na disposição e bem-estar já nas primeiras semanas.",
      ordem: 2,
      ativo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      pergunta: "Como devo administrar o produto?",
      resposta: "A dosagem varia conforme o peso do pet. Para cães até 10kg: 0,5ml por dia. De 10-25kg: 1ml por dia. Acima de 25kg: 1,5ml por dia. Para gatos: 0,5ml por dia. Pode ser misturado na ração ou administrado diretamente. Agite antes de usar e mantenha refrigerado após aberto.",
      ordem: 3,
      ativo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      pergunta: "O produto tem garantia?",
      resposta: "Sim! Oferecemos 30 dias de garantia total. Se você não ficar satisfeito com os resultados, devolvemos 100% do seu dinheiro, sem perguntas. Nossa confiança no produto nos permite oferecer essa garantia completa.",
      ordem: 4,
      ativo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const displayFAQs = faqs && faqs.length > 0 ? faqs : fallbackFAQs;

  return (
    <section id="faq" className="py-16 md:py-24 bg-gradient-to-br from-cream-50 to-leaf-50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-earth-800">
            Dúvidas{" "}
            <span className="text-leaf-600">Frequentes</span>
          </h2>
          <p className="text-xl text-earth-600 max-w-3xl mx-auto">
            Aqui estão as respostas para as perguntas mais comuns sobre 
            nosso Extrato de Juba de Leão para pets.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {displayFAQs.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={`item-${faq.id}`}
                className="bg-white rounded-xl border border-earth-200 px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-earth-800 hover:text-leaf-600 transition-colors py-6">
                  {faq.pergunta}
                </AccordionTrigger>
                <AccordionContent className="text-earth-600 leading-relaxed pb-6">
                  {faq.resposta}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact section */}
        <div className="mt-16 bg-white rounded-2xl p-8 md:p-12 shadow-lg text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-earth-800 mb-4">
            Ainda tem dúvidas?
          </h3>
          <p className="text-earth-600 mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar! Entre em contato conosco 
            pelo WhatsApp ou email e tire todas as suas dúvidas sobre o produto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium transition-colors">
              WhatsApp: (11) 99999-9999
            </button>
            <button className="bg-earth-600 hover:bg-earth-700 text-white px-8 py-3 rounded-full font-medium transition-colors">
              Email: contato@jubadeleaopets.com
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
