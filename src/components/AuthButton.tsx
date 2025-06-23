
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";

const AuthButton = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 text-earth-700">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">
            {user.email?.split('@')[0]}
          </span>
        </div>
        <Button
          onClick={signOut}
          variant="outline"
          size="sm"
          className="border-earth-200 text-earth-700 hover:bg-earth-50"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Sair
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Link to="/login">
        <Button
          variant="outline"
          size="sm"
          className="border-earth-200 text-earth-700 hover:bg-earth-50"
        >
          Entrar
        </Button>
      </Link>
      <Link to="/cadastro">
        <Button
          size="sm"
          className="bg-leaf-600 hover:bg-leaf-700 text-white"
        >
          Cadastrar
        </Button>
      </Link>
    </div>
  );
};

export default AuthButton;
