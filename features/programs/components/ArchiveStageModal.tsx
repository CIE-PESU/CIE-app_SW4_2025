import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProgramStage } from "../types/program.types";

interface ArchiveStageModalProps {
  stage: ProgramStage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (stageId: string) => Promise<void>;
  loading: boolean;
}

export function ArchiveStageModal({ stage, open, onOpenChange, onConfirm, loading }: ArchiveStageModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive Stage?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to archive <strong>{stage?.name}</strong>? 
            This action cannot be undone and will permanently remove this stage from the program year.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => stage && onConfirm(stage.id)}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Archiving..." : "Archive Stage"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
