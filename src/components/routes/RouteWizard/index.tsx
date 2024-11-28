import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Database } from '../../../types/supabase';
import DriverAssignment from './DriverAssignment';
import OrderSelection from './OrderSelection';
import RouteDetails from './RouteDetails';
import RouteConfirmation from './RouteConfirmation';

type Order = Database['public']['Tables']['orders']['Row'];
type Driver = Database['public']['Tables']['drivers']['Row'];

interface RouteWizardProps {
  pendingOrders: Order[];
  availableDrivers: Driver[];
  selectedOrders: Order[];
  onOrderSelect: (order: Order) => void;
  selectedDriver: string;
  onDriverSelect: (driverId: string) => void;
  onCreateRoute: () => void;
  onOptimizeRoute: () => void;
}

type Step = 'driver' | 'orders' | 'details' | 'confirmation';

export default function RouteWizard({
  pendingOrders,
  availableDrivers,
  selectedOrders,
  onOrderSelect,
  selectedDriver,
  onDriverSelect,
  onCreateRoute,
  onOptimizeRoute,
}: RouteWizardProps) {
  const [activeStep, setActiveStep] = useState<Step>('driver');
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set());
  const [expandedStep, setExpandedStep] = useState<Step | null>('driver');

  const handleStepComplete = (step: Step) => {
    setCompletedSteps(prev => new Set([...prev, step]));
    const nextSteps: Record<Step, Step> = {
      driver: 'orders',
      orders: 'details',
      details: 'confirmation',
      confirmation: 'confirmation',
    };
    const nextStep = nextSteps[step];
    setActiveStep(nextStep);
    setExpandedStep(nextStep);
  };

  const handleStepClick = (step: Step) => {
    if (step === 'driver' || completedSteps.has(getPreviousStep(step))) {
      setActiveStep(step);
      setExpandedStep(expandedStep === step ? null : step);
    }
  };

  const getPreviousStep = (step: Step): Step => {
    const steps: Step[] = ['driver', 'orders', 'details', 'confirmation'];
    const currentIndex = steps.indexOf(step);
    return steps[currentIndex - 1] as Step;
  };

  const selectedDriverData = availableDrivers.find(d => d.id === selectedDriver);

  const renderStepContent = (step: Step) => {
    switch (step) {
      case 'driver':
        return (
          <DriverAssignment
            availableDrivers={availableDrivers}
            selectedDriver={selectedDriver}
            onDriverSelect={onDriverSelect}
            onNext={() => handleStepComplete('driver')}
            onBack={() => {}}
          />
        );
      case 'orders':
        return (
          <OrderSelection
            pendingOrders={pendingOrders}
            selectedOrders={selectedOrders}
            selectedDriver={selectedDriverData}
            onOrderSelect={onOrderSelect}
            onNext={() => handleStepComplete('orders')}
            onBack={() => {
              setActiveStep('driver');
              setExpandedStep('driver');
            }}
          />
        );
      case 'details':
        return (
          <RouteDetails
            selectedOrders={selectedOrders}
            selectedDriver={selectedDriverData}
            onOptimizeRoute={onOptimizeRoute}
            onNext={() => handleStepComplete('details')}
            onBack={() => {
              setActiveStep('orders');
              setExpandedStep('orders');
            }}
          />
        );
      case 'confirmation':
        return (
          <RouteConfirmation
            selectedOrders={selectedOrders}
            selectedDriver={selectedDriverData}
            onCreateRoute={onCreateRoute}
            onBack={() => {
              setActiveStep('details');
              setExpandedStep('details');
            }}
          />
        );
      default:
        return null;
    }
  };

  const getStepSummary = (step: Step) => {
    switch (step) {
      case 'driver':
        if (selectedDriver) {
          const driver = availableDrivers.find(d => d.id === selectedDriver);
          return driver ? `Driver: ${driver.full_name}` : null;
        }
        return null;
      case 'orders':
        return selectedOrders.length > 0 ? `${selectedOrders.length} orders selected` : null;
      case 'details':
        return completedSteps.has('details') ? 'Route optimized' : null;
      case 'confirmation':
        return null;
    }
  };

  const steps: { id: Step; title: string }[] = [
    { id: 'driver', title: 'Select Driver' },
    { id: 'orders', title: 'Select Orders' },
    { id: 'details', title: 'Route Details' },
    { id: 'confirmation', title: 'Confirmation' },
  ];

  return (
    <div className="fixed right-6 top-24 w-96 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-2 z-10">
      {steps.map(step => {
        const isActive = activeStep === step.id;
        const isCompleted = completedSteps.has(step.id);
        const isClickable = step.id === 'driver' || completedSteps.has(getPreviousStep(step.id));
        const isExpanded = expandedStep === step.id;
        const summary = getStepSummary(step.id);

        return (
          <div
            key={step.id}
            className={`bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border ${
              isActive ? 'border-primary' : 'border-border'
            }`}
          >
            <button
              onClick={() => handleStepClick(step.id)}
              className={`w-full px-6 py-4 flex items-center justify-between ${
                isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              }`}
              disabled={!isClickable}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : isActive
                      ? 'border-2 border-primary text-primary'
                      : 'border-2 border-muted-foreground text-muted-foreground'
                  }`}
                >
                  {isCompleted ? '✓' : steps.indexOf(step) + 1}
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm text-foreground">{step.title}</span>
                  {summary && !isExpanded && (
                    <span className="text-xs text-muted-foreground">{summary}</span>
                  )}
                </div>
              </div>
              {isClickable && (
                isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )
              )}
            </button>
            {isExpanded && (
              <div className="px-6 pb-6 border-t border-border">
                <div className="pt-6">
                  {renderStepContent(step.id)}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}