import React from "react";
import { CheckCircle2, Circle, Clock, Shield, Unlock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export type OperationStatus = "PENDIENTE" | "FONDEADO" | "EN_CURSO" | "ESPERANDO_LIBERACION" | "LIBERADO" | "EN_DISPUTA";

interface StatusTrackerProps {
  status: OperationStatus;
  className?: string;
}

const steps: { key: OperationStatus; label: string; icon: any }[] = [
  { key: "PENDIENTE", label: "Pendiente", icon: Clock },
  { key: "FONDEADO", label: "En custodia", icon: Shield },
  { key: "EN_CURSO", label: "En curso", icon: Zap },
  { key: "ESPERANDO_LIBERACION", label: "Esperando OK", icon: Unlock },
  { key: "LIBERADO", label: "Liberado", icon: CheckCircle2 },
];

import { Zap } from "lucide-react";

const StatusTracker: React.FC<StatusTrackerProps> = ({ status, className }) => {
  const currentIndex = steps.findIndex((s) => s.key === status);
  const isDispute = status === "EN_DISPUTA";

  return (
    <div className={cn("w-full py-6", className)}>
      {isDispute ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-3 text-red-900 animate-pulse">
           <Shield className="w-6 h-6 text-red-600" />
           <div>
              <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">Operación en Disputa</p>
              <p className="text-xs font-medium opacity-80">El pago está bloqueado preventivamente por el equipo de MDP Market.</p>
           </div>
        </div>
      ) : (
        <div className="relative flex justify-between items-center px-2">
          {/* Progress Bar Background */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 rounded-full z-0" />
          
          {/* Progress Bar Active */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full z-0 transition-all duration-1000 ease-in-out"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            const isCompleted = i < currentIndex;
            const isActive = i === currentIndex;
            
            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center group">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500",
                    isCompleted ? "bg-blue-600 text-white" : 
                    isActive ? "bg-blue-600 text-white ring-8 ring-blue-100 scale-125" : 
                    "bg-white border-2 border-gray-200 text-gray-300"
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span 
                  className={cn(
                    "absolute -bottom-7 whitespace-nowrap text-[9px] font-black uppercase tracking-tighter transition-colors duration-500",
                    isActive ? "text-blue-600" : isCompleted ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StatusTracker;
