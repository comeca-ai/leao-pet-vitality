
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotificationOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface LoadingNotification {
  id: string;
  title: string;
  description?: string;
}

export const useNotifications = () => {
  const { toast } = useToast();
  const [loadingNotifications, setLoadingNotifications] = useState<LoadingNotification[]>([]);

  const showNotification = useCallback((options: NotificationOptions) => {
    const { title, description, variant = 'default', duration, action } = options;
    
    // Mapear variants customizados
    let toastVariant: 'default' | 'destructive' = 'default';
    if (variant === 'destructive') {
      toastVariant = 'destructive';
    }

    toast({
      title,
      description,
      variant: toastVariant,
      duration,
      action: action ? {
        onClick: action.onClick,
        children: action.label,
      } : undefined,
    });
  }, [toast]);

  const showSuccess = useCallback((title: string, description?: string) => {
    showNotification({
      title,
      description,
      variant: 'success',
    });
  }, [showNotification]);

  const showError = useCallback((title: string, description?: string) => {
    showNotification({
      title,
      description,
      variant: 'destructive',
    });
  }, [showNotification]);

  const showWarning = useCallback((title: string, description?: string) => {
    showNotification({
      title,
      description,
      variant: 'warning',
    });
  }, [showNotification]);

  const showInfo = useCallback((title: string, description?: string) => {
    showNotification({
      title,
      description,
      variant: 'default',
    });
  }, [showNotification]);

  const showLoading = useCallback((id: string, title: string, description?: string) => {
    setLoadingNotifications(prev => [...prev, { id, title, description }]);
    
    showNotification({
      title,
      description,
      duration: Infinity, // Não remove automaticamente
    });
  }, [showNotification]);

  const hideLoading = useCallback((id: string) => {
    setLoadingNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showPaymentSuccess = useCallback((orderNumber: string) => {
    showSuccess(
      "Pagamento aprovado! 🎉",
      `Seu pedido #${orderNumber} foi confirmado. Você receberá um e-mail com os detalhes.`
    );
  }, [showSuccess]);

  const showPaymentError = useCallback((message?: string) => {
    showError(
      "Erro no pagamento",
      message || "Houve um problema ao processar seu pagamento. Tente novamente."
    );
  }, [showError]);

  const showOrderCreated = useCallback((orderNumber: string) => {
    showInfo(
      "Pedido criado",
      `Pedido #${orderNumber} criado com sucesso. Redirecionando para o pagamento...`
    );
  }, [showInfo]);

  const showNetworkError = useCallback(() => {
    showError(
      "Erro de conexão",
      "Verifique sua internet e tente novamente."
    );
  }, [showError]);

  const showStockError = useCallback((productName: string) => {
    showWarning(
      "Produto indisponível",
      `${productName} está temporariamente fora de estoque.`
    );
  }, [showWarning]);

  const showValidationError = useCallback((message: string) => {
    showError(
      "Dados incompletos",
      message
    );
  }, [showError]);

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    hideLoading,
    showPaymentSuccess,
    showPaymentError,
    showOrderCreated,
    showNetworkError,
    showStockError,
    showValidationError,
    loadingNotifications,
  };
};
