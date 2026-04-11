import { Button } from "@/components/ui/button";
import { Plus, Layout } from "lucide-react";

interface StageEmptyStateProps {
  onAddClick: () => void;
  isAdminOrFaculty: boolean;
}

export function StageEmptyState({ onAddClick, isAdminOrFaculty }: StageEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
      <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        <Layout className="h-6 w-6 text-blue-600 outline-none" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">No stages yet</h3>
      <p className="text-gray-500 text-center max-w-xs mb-6">
        Add the first stage to get started with your program itinerary and phases.
      </p>
      {isAdminOrFaculty && (
        <Button onClick={onAddClick} size="sm" className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Add the first stage
        </Button>
      )}
    </div>
  );
}
