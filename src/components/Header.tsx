
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    // Se estamos na página inicial, rola para a seção
    if (window.location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
      }
    } else {
      // Se não estamos na página inicial, navega para lá primeiro
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-earth-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-earth-500 to-leaf-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">JL</span>
            </div>
            <div className="font-bold text-xl text-earth-700">
              Juba de Leão <span className="text-leaf-600">Pets</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("beneficios")}
              className="text-earth-600 hover:text-leaf-600 transition-colors"
            >
              Benefícios
            </button>
            <button
              onClick={() => scrollToSection("depoimentos")}
              className="text-earth-600 hover:text-leaf-600 transition-colors"
            >
              Depoimentos
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-earth-600 hover:text-leaf-600 transition-colors"
            >
              FAQ
            </button>
            <Link
              to="/perfil"
              className="text-earth-600 hover:text-leaf-600 transition-colors"
            >
              Meu Perfil
            </Link>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:block">
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-earth-100">
            <nav className="flex flex-col space-y-4 pt-4">
              <button
                onClick={() => scrollToSection("beneficios")}
                className="text-earth-600 hover:text-leaf-600 transition-colors text-left"
              >
                Benefícios
              </button>
              <button
                onClick={() => scrollToSection("depoimentos")}
                className="text-earth-600 hover:text-leaf-600 transition-colors text-left"
              >
                Depoimentos
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-earth-600 hover:text-leaf-600 transition-colors text-left"
              >
                FAQ
              </button>
              <Link
                to="/perfil"
                className="text-earth-600 hover:text-leaf-600 transition-colors text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Meu Perfil
              </Link>
              <div className="pt-2 border-t border-earth-100">
                <AuthButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
