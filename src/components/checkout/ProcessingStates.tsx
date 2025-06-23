
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle, CreditCard, Mail } from "lucide-react";

interface ProcessingStatesProps {
  currentState: 'idle' | 'validating' | 'creating-order' | 'sending-email' | 'redirecting' | 'complete';
}

const ProcessingStates = ({ currentState }: ProcessingStatesProps) => {
  const states = [
    { key: 'validating', label: 'Validando dados', icon: CheckCircle },
    { key: 'creating-order', label: 'Criando pedido', icon: CreditCard },
    { key: 'sending-email', label: 'Enviando confirmação', icon: Mail },
    { key: 'redirecting', label: 'Redirecionando...', icon: CreditCard },
  ];

  if (currentState === 'idle') return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-3">
        <LoadingSpinner size="sm" className="text-blue-600" />
        <div className="flex-1">
          {states.map((state) => {
            const Icon = state.icon;
            const isActive = currentState === state.key;
            const isCompleted = states.findIndex(s => s.key === currentState) > states.findIndex(s => s.key === state.key);
            
            return (
              <div key={state.key} className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                isActive ? 'text-blue-800 font-medium' : isCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                <Icon className={`w-4 h-4 ${isCompleted ? 'text-green-600' : ''}`} />
                <span>{state.label}</span>
                {isCompleted && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProcessingStates;
