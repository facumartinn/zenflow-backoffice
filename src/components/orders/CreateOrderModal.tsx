import { useForm } from 'react-hook-form';
import { Database } from '../../types/supabase';

type OrderInsert = Database['public']['Tables']['orders']['Insert'];

interface CreateOrderModalProps {
  onClose: () => void;
  onSubmit: (data: Omit<OrderInsert, 'id' | 'created_at' | 'route_id'>) => void;
}

export default function CreateOrderModal({ onClose, onSubmit }: CreateOrderModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-card/50 backdrop-blur-sm px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 border border-border">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-medium text-foreground">Create New Order</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    {...register('customer_name', { required: 'Customer name is required' })}
                    className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.customer_name && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.customer_name.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register('customer_phone', { required: 'Phone number is required' })}
                    className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.customer_phone && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.customer_phone.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Delivery Address
                  </label>
                  <textarea
                    {...register('delivery_address', { required: 'Address is required' })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.delivery_address && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.delivery_address.message as string}
                    </p>
                  )}
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 sm:ml-3 sm:w-auto"
                  >
                    Create Order
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}