
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay = ({ isVisible, message = "Processando..." }: LoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4 text-leaf-600" />
        <h3 className="text-lg font-semibold text-earth-800 mb-2">
          {message}
        </h3>
        <p className="text-earth-600 text-sm">
          Por favor, aguarde um momento...
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
