import { ClipboardList } from 'lucide-react';

export default function PickingLists() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Picking Lists</h1>
      </div>

      <div className="text-center py-12 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
        <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No picking lists available</h3>
        <p className="text-sm text-muted-foreground">
          Create picking lists to organize order fulfillment
        </p>
      </div>
    </div>
  );
}