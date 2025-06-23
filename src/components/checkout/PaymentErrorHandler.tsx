
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentError {
  type: 'network' | 'validation' | 'stripe' | 'stock' | 'unknown';
  message: string;
  details?: string;
}

interface PaymentErrorHandlerProps {
  error: PaymentError;
  onRetry: () => void;
  onGoBack: () => void;
}

const PaymentErrorHandler = ({ error, onRetry, onGoBack }: PaymentErrorHandlerProps) => {
  const getErrorTitle = () => {
    switch (error.type) {
      case 'network':
        return 'Erro de Conexão';
      case 'validation':
        return 'Dados Incompletos';
      case 'stripe':
        return 'Erro no Pagamento';
      case 'stock':
        return 'Estoque Insuficiente';
      default:
        return 'Erro Inesperado';
    }
  };

  const getErrorIcon = () => {
    return <AlertCircle className="w-12 h-12 text-red-500" />;
  };

  const getActionButtons = () => {
    switch (error.type) {
      case 'network':
        return (
          <div className="flex gap-3">
            <Button variant="outline" onClick={onGoBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={onRetry}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        );
      
      case 'validation':
        return (
          <Button onClick={onGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Corrigir Dados
          </Button>
        );
      
      case 'stock':
        return (
          <div className="flex gap-3">
            <Button variant="outline" onClick={onGoBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ajustar Quantidade
            </Button>
            <Button onClick={onRetry}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Verificar Novamente
            </Button>
          </div>
        );
      
      default:
        return (
          <div className="flex gap-3">
            <Button variant="outline" onClick={onGoBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={onRetry}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        );
    }
  };

  return (
    <Card className="border-red-200 shadow-lg max-w-md mx-auto">
      <CardHeader className="text-center bg-red-50">
        <div className="flex justify-center mb-2">
          {getErrorIcon()}
        </div>
        <CardTitle className="text-red-700">{getErrorTitle()}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4 p-6">
        <p className="text-gray-700">{error.message}</p>
        
        {error.details && (
          <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
            <strong>Detalhes:</strong> {error.details}
          </div>
        )}

        <div className="pt-4">
          {getActionButtons()}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentErrorHandler;
