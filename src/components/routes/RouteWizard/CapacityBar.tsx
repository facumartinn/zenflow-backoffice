import { Package } from 'lucide-react';

interface CapacityBarProps {
  currentVolume: number;
  maxCapacity: number;
}

export default function CapacityBar({ currentVolume, maxCapacity }: CapacityBarProps) {
  const percentage = (currentVolume / maxCapacity) * 100;
  const isOverCapacity = currentVolume > maxCapacity;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">Vehicle Capacity</span>
        </div>
        <span className={`font-medium ${isOverCapacity ? 'text-destructive' : 'text-foreground'}`}>
          {currentVolume.toFixed(1)} / {maxCapacity.toFixed(1)} m³
        </span>
      </div>
      
      <div className="h-2 bg-accent rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isOverCapacity ? 'bg-destructive' : 'bg-primary'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {isOverCapacity && (
        <p className="text-xs text-destructive">
          Warning: Selected orders exceed vehicle capacity
        </p>
      )}
    </div>
  );
}