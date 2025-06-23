
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutProgressProps {
  currentStep: number;
}

const CheckoutProgress = ({ currentStep }: CheckoutProgressProps) => {
  const steps = [
    { id: 1, name: "Informações", description: "Dados pessoais" },
    { id: 2, name: "Produto", description: "Quantidade e preço" },
    { id: 3, name: "Pagamento", description: "Finalizar compra" }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  currentStep > step.id
                    ? "bg-green-500 text-white"
                    : currentStep === step.id
                    ? "bg-leaf-500 text-white"
                    : "bg-earth-200 text-earth-600"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={cn(
                  "text-sm font-medium",
                  currentStep >= step.id ? "text-earth-800" : "text-earth-500"
                )}>
                  {step.name}
                </div>
                <div className="text-xs text-earth-500">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-4 transition-all duration-300",
                currentStep > step.id ? "bg-green-500" : "bg-earth-200"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutProgress;
