"use client";

import { useState } from "react";
import { usePrograms } from "@/features/programs/hooks/usePrograms";
import { ProgramList } from "@/features/programs/components/ProgramList";
import { ProgramDetail } from "@/features/programs/components/ProgramDetail";
import { CreateProgramModal } from "@/features/programs/components/CreateProgramModal";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { BaseProgram } from "@/features/programs/types/program.types";
import { useAuth } from "@/components/auth-provider";

export function ManagePrograms() {
  const { user } = useAuth();
  const { programs, loading, refresh } = usePrograms();
  const [selectedProgram, setSelectedProgram] = useState<BaseProgram | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const isAdminOrFaculty = user?.role === "ADMIN" || user?.role === "FACULTY";

  return (
    <div className="w-full p-0 space-y-6">
      {/* Header */}
      {!selectedProgram && (
        <div className="flex justify-between items-center">
          <h2 className="admin-page-title">Programs</h2>
          <div className="flex items-center gap-2">
            <Button onClick={refresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {isAdminOrFaculty && (
              <Button onClick={() => setIsCreateOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Program
              </Button>
            )}
          </div>
        </div>
      )}

      {selectedProgram ? (
        <ProgramDetail 
          program={selectedProgram} 
          onBack={() => { setSelectedProgram(null); refresh(); }} 
          onUpdate={(updated) => { setSelectedProgram(updated); refresh(); }}
          onArchive={() => { setSelectedProgram(null); refresh(); }}
        />
      ) : (
        <ProgramList 
          programs={programs} 
          loading={loading} 
          onProgramClick={setSelectedProgram}
          onAddClick={() => setIsCreateOpen(true)}
          isAdminOrFaculty={isAdminOrFaculty}
        />
      )}

      <CreateProgramModal 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onSuccess={(p) => { setSelectedProgram(p); refresh(); }} 
      />
    </div>
  );
}
