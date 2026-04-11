import { useState } from "react";
import { BaseProgram, ProgramYear } from "../types/program.types";
import { useProgramYears } from "../hooks/useProgramYears";
import { ProgramYearCard } from "./ProgramYearCard";
import { YearSkeleton } from "./ProgramSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Archive, ChevronLeft } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { programsService } from "../services/programs.service";
import { AddYearModal } from "./AddYearModal";
import { EditYearModal } from "./EditYearModal";
import { EditProgramModal } from "./EditProgramModal";

interface ProgramDetailProps {
  program: BaseProgram;
  onBack: () => void;
  onUpdate: (updated: BaseProgram) => void;
  onArchive: () => void;
}

export function ProgramDetail({ program, onBack, onUpdate, onArchive }: ProgramDetailProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { years, loading, refresh } = useProgramYears(program.id);
  
  const [isAddYearOpen, setIsAddYearOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<ProgramYear | null>(null);
  const [isEditProgramOpen, setIsEditProgramOpen] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const isAdmin = user?.role === "ADMIN";
  const isAdminOrFaculty = user?.role === "ADMIN" || user?.role === "FACULTY";

  const handleEnroll = async (year: ProgramYear) => {
    if (!user) return;
    try {
      setIsEnrolling(true);
      await programsService.enrollInYear(user.id, program.id, year.id);
      toast({ title: "Enrolled!", description: `You have successfully enrolled in ${year.label}` });
    } catch (error: any) {
      toast({
        title: "Enrollment Failed",
        description: error.message || "Failed to enroll",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleArchive = async () => {
    if (!user) return;
    try {
      await programsService.archiveProgram(user.id, program.id);
      toast({ title: "Program Archived" });
      onArchive();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to archive program",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="-ml-2 h-8 text-gray-500">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Programs
      </Button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-white p-6 rounded-xl border shadow-sm">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">{program.name}</h2>
            <Badge className={program.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
              {program.status}
            </Badge>
          </div>
          <p className="text-gray-600 max-w-3xl">{program.description}</p>
        </div>

        <div className="flex items-center gap-2">
          {isAdminOrFaculty && (
            <Button variant="outline" size="sm" onClick={() => setIsEditProgramOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          {isAdmin && (
            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleArchive}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Program Years</h3>
          {isAdminOrFaculty && (
            <Button size="sm" onClick={() => setIsAddYearOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Year
            </Button>
          )}
        </div>

        {loading ? (
          <YearSkeleton count={2} />
        ) : years.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
            <p className="text-gray-500">No years added to this program yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {years.map(year => (
              <ProgramYearCard 
                key={year.id} 
                year={year} 
                onEnroll={handleEnroll} 
                onEdit={setEditingYear}
                isEnrolling={isEnrolling}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddYearModal 
        program={program} 
        open={isAddYearOpen} 
        onOpenChange={setIsAddYearOpen} 
        onSuccess={() => { refresh(); }} 
      />
      <EditYearModal 
        year={editingYear} 
        open={!!editingYear} 
        onOpenChange={(open) => !open && setEditingYear(null)} 
        onSuccess={() => { refresh(); setEditingYear(null); }} 
      />
      <EditProgramModal 
        program={program} 
        open={isEditProgramOpen} 
        onOpenChange={setIsEditProgramOpen} 
        onSuccess={onUpdate} 
      />
    </div>
  );
}
