
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Star, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-gradient-to-br from-cream-50 to-cream-100 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge className="bg-leaf-100 text-leaf-700 border-leaf-300 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                {{HERO_BADGE_TEXT}}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-earth-800 leading-tight">
                {{HERO_TITLE_PREFIX}}{" "}
                <span className="text-leaf-600">{{HERO_TITLE_HIGHLIGHT}}</span>{" "}
                {{HERO_TITLE_SUFFIX}}
              </h1>
              
              <p className="text-xl text-earth-600 leading-relaxed">
                {{HERO_DESCRIPTION}}
              </p>
            </div>

            {/* Benefits highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-earth-700">
                <div className="w-2 h-2 bg-leaf-500 rounded-full"></div>
                <span className="font-medium">Reforça Imunidade</span>
              </div>
              <div className="flex items-center space-x-2 text-earth-700">
                <div className="w-2 h-2 bg-leaf-500 rounded-full"></div>
                <span className="font-medium">Melhora Cognição</span>
              </div>
              <div className="flex items-center space-x-2 text-earth-700">
                <div className="w-2 h-2 bg-leaf-500 rounded-full"></div>
                <span className="font-medium">Bem-estar Geral</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/checkout">
                <Button 
                  size="lg" 
                  className="bg-leaf-600 hover:bg-leaf-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Truck className="w-5 h-5 mr-2" />
                  {{HERO_CTA_PRIMARY_TEXT}}
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => scrollToSection("beneficios")}
                className="border-earth-300 text-earth-700 hover:bg-earth-50 px-8 py-4 text-lg rounded-full"
              >
                {{HERO_CTA_SECONDARY_TEXT}}
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-earth-600 font-medium">4.9/5 (127 avaliações)</span>
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="relative animate-scale-in">
            <div className="bg-gradient-to-br from-leaf-100 to-earth-100 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-full h-80 bg-gradient-to-br from-earth-200 to-leaf-200 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-32 bg-earth-500 rounded-lg mx-auto mb-4 shadow-lg"></div>
                    <p className="text-earth-700 font-semibold">Extrato de Juba de Leão</p>
                    <p className="text-earth-500 text-sm">Para Pets - 30ml</p>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
                <Shield className="w-6 h-6 text-leaf-600" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
