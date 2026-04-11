import { Button } from "@/components/ui/button";
import { FolderOpen, Plus } from "lucide-react";

interface ProgramEmptyStateProps {
  onAdd?: () => void;
  title?: string;
  description?: string;
}

export function ProgramEmptyState({ onAdd, title, description }: ProgramEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
        <FolderOpen className="h-10 w-10 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title || "No Programs Found"}
      </h3>
      <p className="text-gray-500 max-w-sm mb-8">
        {description || "There are no programs available at the moment. Base programs are used to organize yearly instances and cohorts."}
      </p>
      
      {onAdd && (
        <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create First Program
        </Button>
      )}
    </div>
  );
}
