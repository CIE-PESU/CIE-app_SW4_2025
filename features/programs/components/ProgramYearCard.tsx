import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgramYear } from "../types/program.types";
import { Calendar, Clock, Edit2, Layers } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";

interface ProgramYearCardProps {
  year: ProgramYear;
  onEnroll?: (year: ProgramYear) => void;
  onEdit?: (year: ProgramYear) => void;
  isEnrolling?: boolean;
}

export function ProgramYearCard({ year, onEnroll, onEdit, isEnrolling }: ProgramYearCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const isAdminOrFaculty = user?.role === "ADMIN" || user?.role === "FACULTY";
  const isStudent = user?.role === "STUDENT";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "ongoing": return "bg-orange-100 text-orange-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleClick = () => {
    router.push(`/programs/${year.programId}/${year.id}`);
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{year.label}</h4>
              <Badge className={`${getStatusColor(year.status)} text-[10px] px-2 py-0`}>
                {year.status}
              </Badge>
              {year.stageCount !== undefined && (
                <div className="flex items-center gap-1.5 ml-2 px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                  <Layers className="h-3 w-3" />
                  {year.stageCount} {year.stageCount === 1 ? "Stage" : "Stages"}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(year.startDate)} - {formatDate(year.endDate)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Year: {year.year}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {isStudent && onEnroll && (
              <Button 
                size="sm" 
                onClick={() => onEnroll(year)}
                disabled={isEnrolling || year.status === "completed"}
              >
                Enroll
              </Button>
            )}
            {isAdminOrFaculty && onEdit && (
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(year)}>
                <Edit2 className="h-4 w-4 text-gray-500" />
              </Button>
            )}
          </div>
        </div>
        {year.description && (
          <p className="mt-2 text-xs text-gray-600 line-clamp-1">
            {year.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

