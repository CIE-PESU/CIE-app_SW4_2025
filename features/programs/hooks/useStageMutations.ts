import React, { useState, useCallback } from "react";
import { ProgramStage } from "../types/program.types";
import { programsService } from "../services/programs.service";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";

export function useStageMutations(programId: string, yearId: string, onUpdate: () => void) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isMutating, setIsMutating] = useState(false);

  const createStage = useCallback(async (data: Partial<ProgramStage>) => {
    if (!user) return;
    try {
      setIsMutating(true);
      await programsService.createStage(user.id, programId, yearId, data);
      toast({ title: "Success", description: "Stage created successfully" });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create stage",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsMutating(false);
    }
  }, [user, programId, yearId, toast, onUpdate]);

  const updateStage = useCallback(async (stageId: string, data: Partial<ProgramStage>) => {
    if (!user) return;
    try {
      setIsMutating(true);
      await programsService.updateStage(user.id, programId, yearId, stageId, data);
      toast({ title: "Success", description: "Stage updated successfully" });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update stage",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsMutating(false);
    }
  }, [user, programId, yearId, toast, onUpdate]);

  const deleteStage = useCallback(async (stageId: string) => {
    if (!user) return;
    try {
      setIsMutating(true);
      await programsService.deleteStage(user.id, programId, yearId, stageId);
      toast({ title: "Success", description: "Stage deleted successfully" });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete stage",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsMutating(false);
    }
  }, [user, programId, yearId, toast, onUpdate]);

  const reorderStages = useCallback(async (orderedIds: string[]) => {
    if (!user) return;
    try {
      await programsService.reorderStages(user.id, programId, yearId, orderedIds);
    } catch (error: any) {
      toast({
        title: "Reorder Failed",
        description: error.message || "Failed to save new order",
        variant: "destructive",
      });
      onUpdate();
      throw error;
    }
  }, [user, programId, yearId, toast, onUpdate]);

  return React.useMemo(() => ({
    createStage,
    updateStage,
    deleteStage,
    reorderStages,
    isMutating
  }), [createStage, updateStage, deleteStage, reorderStages, isMutating]);
}
