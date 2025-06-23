
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria implementada a lógica de recuperação de senha
    console.log("E-mail para recuperação:", email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-earth-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-earth-500 to-leaf-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">JL</span>
            </div>
            <div className="font-bold text-xl text-earth-700">
              Juba de Leão <span className="text-leaf-600">Pets</span>
            </div>
          </Link>
        </div>

        <Card className="border-earth-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-earth-700">
              Recuperar Senha
            </CardTitle>
            <CardDescription className="text-earth-600">
              Digite seu e-mail para receber as instruções de recuperação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-earth-700 font-medium">
                  E-mail
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-earth-200 focus:border-leaf-500 focus:ring-leaf-500"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-leaf-600 hover:bg-leaf-700 text-white font-semibold py-3 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Enviar Instruções
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-earth-600 text-sm mb-4">
                Lembrou da sua senha?{" "}
                <Link
                  to="/login"
                  className="text-leaf-600 hover:text-leaf-700 font-semibold hover:underline transition-colors"
                >
                  Fazer login
                </Link>
              </p>
              
              <p className="text-earth-600 text-sm">
                Não tem uma conta?{" "}
                <Link
                  to="/cadastro"
                  className="text-leaf-600 hover:text-leaf-700 font-semibold hover:underline transition-colors"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-earth-600 hover:text-leaf-600 text-sm hover:underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;
