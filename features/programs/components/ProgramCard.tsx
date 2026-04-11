import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BaseProgram } from "../types/program.types";
import { GraduationCap, Calendar, Info } from "lucide-react";

interface ProgramCardProps {
  program: BaseProgram;
  onClick: (program: BaseProgram) => void;
}

export function ProgramCard({ program, onClick }: ProgramCardProps) {
  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500"
      onClick={() => onClick(program)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2 flex-1 min-w-0">
            <GraduationCap className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <span className="truncate">{program.name}</span>
          </CardTitle>
          <Badge className={`${getStatusColor(program.status)} text-xs flex-shrink-0`}>
            {program.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
          {program.description || "No description provided."}
        </p>
        
        <div className="flex items-center justify-between pt-2 border-t text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {program.yearCount || 0} Years
          </div>
          <div className="flex items-center gap-1">
            <Info className="h-3.5 w-3.5" />
            {new Date(program.createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
