import { ArrowLeft } from 'lucide-react';
import { Database } from '../../../types/supabase';

type Driver = Database['public']['Tables']['drivers']['Row'];

interface DriverAssignmentProps {
  availableDrivers: Driver[];
  selectedDriver: string;
  onDriverSelect: (driverId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DriverAssignment({
  availableDrivers,
  selectedDriver,
  onDriverSelect,
  onNext,
  onBack,
}: DriverAssignmentProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Select Driver
        </label>
        <div className="space-y-2">
          {availableDrivers.map((driver) => (
            <button
              key={driver.id}
              onClick={() => onDriverSelect(driver.id)}
              className={`w-full flex items-center justify-between p-3 rounded-md ${
                selectedDriver === driver.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent/50 text-foreground hover:bg-accent'
              }`}
            >
              <div>
                <p className="font-medium">{driver.full_name}</p>
                <p className="text-sm">{driver.email}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500">
                Available
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 border border-border rounded-md hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <button
          onClick={onNext}
          disabled={!selectedDriver}
          className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}