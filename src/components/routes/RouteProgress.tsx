import { CheckCircle2, Circle, CircleDot } from 'lucide-react';

interface RouteProgressProps {
  steps: {
    label: string;
    status: 'completed' | 'current' | 'pending';
  }[];
}

export default function RouteProgress({ steps }: RouteProgressProps) {
  return (
    <div className="fixed bottom-6 right-6 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border p-4 z-10">
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center space-x-3">
            {step.status === 'completed' ? (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            ) : step.status === 'current' ? (
              <CircleDot className="h-5 w-5 text-primary animate-pulse" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
            <span className={`text-sm ${
              step.status === 'completed' ? 'text-primary' :
              step.status === 'current' ? 'text-foreground' :
              'text-muted-foreground'
            }`}>
              {index + 1}. {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}