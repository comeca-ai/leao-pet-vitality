
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StepTransitionProps {
  isActive: boolean;
  isCompleted: boolean;
  children: ReactNode;
  className?: string;
}

const StepTransition = ({ isActive, isCompleted, children, className }: StepTransitionProps) => {
  return (
    <div className={cn(
      "transition-all duration-500 ease-in-out",
      isActive ? "opacity-100 scale-100" : "opacity-50 scale-95",
      isCompleted && "ring-2 ring-green-200 rounded-lg",
      className
    )}>
      {children}
    </div>
  );
};

export default StepTransition;
