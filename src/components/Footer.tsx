
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-earth-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-earth-500 to-leaf-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">JL</span>
              </div>
              <div className="font-bold text-xl">
                Juba de Leão <span className="text-leaf-400">Pets</span>
              </div>
            </div>
            <p className="text-earth-300 leading-relaxed">
              O único extrato de Juba de Leão para pets aprovado pelo MAPA. 
              Cuidando da saúde e bem-estar do seu pet com segurança e qualidade.
            </p>
            <div className="flex space-x-4">
              <button className="w-10 h-10 bg-earth-700 hover:bg-leaf-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-earth-700 hover:bg-leaf-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#beneficios" className="text-earth-300 hover:text-leaf-400 transition-colors">
                  Benefícios
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="text-earth-300 hover:text-leaf-400 transition-colors">
                  Depoimentos
                </a>
              </li>
              <li>
                <a href="#precos" className="text-earth-300 hover:text-leaf-400 transition-colors">
                  Preços
                </a>
              </li>
              <li>
                <a href="#faq" className="text-earth-300 hover:text-leaf-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-earth-300 hover:text-leaf-400 transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-earth-300 hover:text-leaf-400 transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-earth-300 hover:text-leaf-400 transition-colors">
                  Política de Troca
                </a>
              </li>
              <li>
                <a href="#" className="text-earth-300 hover:text-leaf-400 transition-colors">
                  Rastreamento
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-leaf-400" />
                <span className="text-earth-300">(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-leaf-400" />
                <span className="text-earth-300">contato@jubadeleaopets.com</span>
              </div>
            </div>
            
            <div className="bg-earth-700 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-leaf-400">Horário de Atendimento</h4>
              <p className="text-earth-300 text-sm">
                Segunda a Sexta: 9h às 18h<br />
                Sábado: 9h às 14h
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-earth-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-earth-400 text-sm">
              © 2024 Juba de Leão Pets. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-4 text-earth-400 text-sm">
              <span>CNPJ: 00.000.000/0001-00</span>
              <span>•</span>
              <span>Registro MAPA: 12345-6</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
