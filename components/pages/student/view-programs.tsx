"use client";

import { useState } from "react";
import { usePrograms } from "@/features/programs/hooks/usePrograms";
import { ProgramList } from "@/features/programs/components/ProgramList";
import { ProgramDetail } from "@/features/programs/components/ProgramDetail";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { BaseProgram } from "@/features/programs/types/program.types";

export function ViewPrograms() {
  const { programs, loading, refresh } = usePrograms();
  const [selectedProgram, setSelectedProgram] = useState<BaseProgram | null>(null);

  return (
    <div className="w-full p-0 space-y-6">
      {/* Header */}
      {!selectedProgram && (
        <div className="flex justify-between items-center">
          <h2 className="admin-page-title">Programs</h2>
          <Button onClick={refresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
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
          onAddClick={() => {}} 
          isAdminOrFaculty={false}
        />
      )}
    </div>
  );
}
