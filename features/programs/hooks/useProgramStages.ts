import React, { useState, useEffect, useCallback } from "react";
import { ProgramStage } from "../types/program.types";
import { programsService } from "../services/programs.service";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";

export function useProgramStages(programId: string, yearId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stages, setStages] = useState<ProgramStage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStages = useCallback(async () => {
    if (!user || !programId || !yearId) return;
    try {
      setLoading(true);
      const data = await programsService.getProgramStages(user.id, programId, yearId);
      setStages(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load program stages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, programId, yearId]);


  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  return React.useMemo(() => ({ 
    stages, 
    setStages, 
    loading, 
    refresh: fetchStages 
  }), [stages, loading, fetchStages]);
}

