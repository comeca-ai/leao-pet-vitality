
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "O Extrato de Juba de Leão é seguro para meu pet?",
      answer: "Sim, nosso produto é 100% seguro e aprovado pelo MAPA (Ministério da Agricultura, Pecuária e Abastecimento). É desenvolvido especificamente para pets, seguindo rigorosos padrões de qualidade e segurança. Recomendamos sempre consultar um veterinário antes de iniciar qualquer suplementação."
    },
    {
      question: "Em quanto tempo vou ver os resultados?",
      answer: "Os primeiros sinais de melhora geralmente aparecem entre 2-4 semanas de uso contínuo. Para resultados mais significativos, recomendamos o uso por pelo menos 60-90 dias. Cada pet responde de forma diferente, mas a maioria dos tutores reporta melhorias na disposição e bem-estar já nas primeiras semanas."
    },
    {
      question: "Como devo administrar o produto?",
      answer: "A dosagem varia conforme o peso do pet. Para cães até 10kg: 0,5ml por dia. De 10-25kg: 1ml por dia. Acima de 25kg: 1,5ml por dia. Para gatos: 0,5ml por dia. Pode ser misturado na ração ou administrado diretamente. Agite antes de usar e mantenha refrigerado após aberto."
    },
    {
      question: "O produto tem garantia?",
      answer: "Sim! Oferecemos 30 dias de garantia total. Se você não ficar satisfeito com os resultados, devolvemos 100% do seu dinheiro, sem perguntas. Nossa confiança no produto nos permite oferecer essa garantia completa."
    },
    {
      question: "Qual a forma de entrega e prazo?",
      answer: "Trabalhamos com frete grátis para todo o Brasil via Correios. O prazo de entrega varia de 3-7 dias úteis para a região Sudeste/Sul e 5-10 dias úteis para outras regiões. Você recebe o código de rastreamento por email assim que o produto for postado."
    },
    {
      question: "Posso dar para filhotes ou pets idosos?",
      answer: "Sim, o produto é seguro para pets de todas as idades. Para filhotes a partir de 6 meses, use metade da dose recomendada. Para pets idosos, o produto é especialmente benéfico, ajudando na cognição e vitalidade. Sempre consulte seu veterinário para orientações específicas."
    }
  ];

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
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-xl border border-earth-200 px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-earth-800 hover:text-leaf-600 transition-colors py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-earth-600 leading-relaxed pb-6">
                  {faq.answer}
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
