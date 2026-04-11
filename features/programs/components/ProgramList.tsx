import { useState } from "react";
import { ProgramCard } from "./ProgramCard";
import { BaseProgram } from "../types/program.types";
import { Input } from "@/components/ui/input";
import { Search, Filter, FolderOpen } from "lucide-react";
import { ProgramSkeleton } from "./ProgramSkeleton";
import { ProgramEmptyState } from "./ProgramEmptyState";

interface ProgramListProps {
  programs: BaseProgram[];
  loading: boolean;
  onProgramClick: (program: BaseProgram) => void;
  onAddClick: () => void;
  isAdminOrFaculty: boolean;
}

export function ProgramList({ programs, loading, onProgramClick, onAddClick, isAdminOrFaculty }: ProgramListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPrograms = programs.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <ProgramSkeleton count={6} />;
  }

  if (programs.length === 0) {
    return <ProgramEmptyState onAdd={isAdminOrFaculty ? onAddClick : undefined} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search programs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Filter className="h-5 w-5 text-gray-400 mx-2 hidden md:inline-block" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <span className="text-sm text-muted-foreground ml-auto">
          Showing {filteredPrograms.length} of {programs.length} programs
        </span>
      </div>

      {filteredPrograms.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
          <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <div className="text-lg font-medium mb-2">No programs match your search</div>
          <p className="text-sm">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map(program => (
            <ProgramCard 
              key={program.id} 
              program={program} 
              onClick={onProgramClick} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
