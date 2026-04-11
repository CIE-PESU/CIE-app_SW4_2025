import { useState, useEffect, useCallback } from "react";
import { BaseProgram } from "../types/program.types";
import { programsService } from "../services/programs.service";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";

export function usePrograms() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [programs, setPrograms] = useState<BaseProgram[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrograms = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await programsService.getPrograms(user.id);
      setPrograms(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load programs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return { programs, loading, refresh: fetchPrograms };
}
