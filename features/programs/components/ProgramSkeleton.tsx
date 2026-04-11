import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProgramSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-3">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/4"></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-8 bg-gray-50 rounded w-full mt-4"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function YearSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
      ))}
    </div>
  );
}
