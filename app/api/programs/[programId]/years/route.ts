import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserById } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { programId: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { programId } = params;

    const years = await prisma.programYear.findMany({
      where: { program_id: programId },
      include: {
        _count: {
          select: { stages: true }
        }
      },
      orderBy: { year: "desc" }
    });

    const mappedYears = years.map(y => ({
      id: y.id,
      programId: y.program_id,
      year: y.year,
      label: y.label,
      description: y.description || undefined,
      startDate: y.start_date.toISOString(),
      endDate: y.end_date.toISOString(),
      status: y.status as any,
      createdAt: y.created_at.toISOString(),
      createdBy: y.created_by,
      stageCount: y._count.stages
    }));

    return NextResponse.json({ years: mappedYears });

  } catch (error) {
    console.error("Error fetching program years:", error);
    return NextResponse.json({ error: "Failed to fetch program years" }, { status: 500 });
  }
}


export async function POST(
  request: Request,
  { params }: { params: { programId: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user || (user.role !== "ADMIN" && user.role !== "FACULTY")) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { programId } = params;
    const data = await request.json();
    const { year, label, description, startDate, endDate, status } = data;

    if (!year || !startDate) {
      return NextResponse.json({ error: "Year and Start Date are required" }, { status: 400 });
    }

    // Duplicate check
    const existing = await prisma.programYear.findUnique({
      where: {
        program_id_year: {
          program_id: programId,
          year: parseInt(year)
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: `Year ${year} already exists for this program` }, { status: 400 });
    }

    const y = await prisma.programYear.create({
      data: {
        program_id: programId,
        year: parseInt(year),
        label: label,
        description,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        status: status || "upcoming",
        created_by: userId
      }
    });

    const mappedYear = {
      id: y.id,
      programId: y.program_id,
      year: y.year,
      label: y.label,
      description: y.description || undefined,
      startDate: y.start_date.toISOString(),
      endDate: y.end_date.toISOString(),
      status: y.status as any,
      createdAt: y.created_at.toISOString(),
      createdBy: y.created_by,
      stageCount: 0
    };

    return NextResponse.json({ year: mappedYear });

  } catch (error: any) {
    console.error("Error creating program year:", error);
    return NextResponse.json({ error: error.message || "Failed to create program year" }, { status: 500 });
  }
}
