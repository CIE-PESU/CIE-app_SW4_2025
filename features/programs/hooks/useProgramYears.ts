import React, { useState, useEffect, useCallback } from "react";
import { ProgramYear } from "../types/program.types";
import { programsService } from "../services/programs.service";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";

export function useProgramYears(programId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [years, setYears] = useState<ProgramYear[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchYears = useCallback(async () => {
    if (!user || !programId) return;
    try {
      setLoading(true);
      const data = await programsService.getProgramYears(user.id, programId);
      setYears(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load program years",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, programId]);


  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  return React.useMemo(() => ({ 
    years, 
    loading, 
    refresh: fetchYears 
  }), [years, loading, fetchYears]);
}
