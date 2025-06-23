
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-earth-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-earth-500 to-leaf-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">JL</span>
            </div>
            <div className="font-bold text-xl text-earth-700">
              Juba de Leão <span className="text-leaf-600">Pets</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#beneficios" className="text-earth-600 hover:text-leaf-600 transition-colors">
              Benefícios
            </a>
            <a href="#depoimentos" className="text-earth-600 hover:text-leaf-600 transition-colors">
              Depoimentos
            </a>
            <a href="#precos" className="text-earth-600 hover:text-leaf-600 transition-colors">
              Preços
            </a>
            <a href="#faq" className="text-earth-600 hover:text-leaf-600 transition-colors">
              FAQ
            </a>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login"
                className="text-earth-600 hover:text-leaf-600 transition-colors font-medium"
              >
                Entrar
              </Link>
              <Link to="/cadastro">
                <Button className="bg-earth-600 hover:bg-earth-700 text-white px-4 py-2 rounded-full">
                  Cadastrar
                </Button>
              </Link>
              <Button className="bg-leaf-600 hover:bg-leaf-700 text-white px-6 py-2 rounded-full">
                Comprar Agora
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-earth-200">
            <nav className="flex flex-col space-y-4">
              <a href="#beneficios" className="text-earth-600 hover:text-leaf-600 transition-colors">
                Benefícios
              </a>
              <a href="#depoimentos" className="text-earth-600 hover:text-leaf-600 transition-colors">
                Depoimentos
              </a>
              <a href="#precos" className="text-earth-600 hover:text-leaf-600 transition-colors">
                Preços
              </a>
              <a href="#faq" className="text-earth-600 hover:text-leaf-600 transition-colors">
                FAQ
              </a>
              <div className="flex flex-col space-y-2 pt-2">
                <Link 
                  to="/login"
                  className="text-earth-600 hover:text-leaf-600 transition-colors font-medium text-center"
                >
                  Entrar
                </Link>
                <Link to="/cadastro">
                  <Button className="bg-earth-600 hover:bg-earth-700 text-white w-full rounded-full">
                    Cadastrar
                  </Button>
                </Link>
                <Button className="bg-leaf-600 hover:bg-leaf-700 text-white w-full rounded-full">
                  Comprar Agora
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
