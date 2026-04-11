import { getUserById } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(
  request: Request,
  { params }: { params: { programId: string; yearId: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { yearId } = params;

    const programYear = await prisma.programYear.findUnique({
      where: { id: yearId },
      include: {
        program: true,
        _count: {
          select: { stages: true }
        }
      }
    });

    if (!programYear) {
      return NextResponse.json({ error: "Program year not found" }, { status: 404 });
    }

    const mappedYear = {
      id: programYear.id,
      programId: programYear.program_id,
      year: programYear.year,
      label: programYear.label,
      description: programYear.description || undefined,
      startDate: programYear.start_date.toISOString(),
      endDate: programYear.end_date.toISOString(),
      status: programYear.status as any,
      createdAt: programYear.created_at.toISOString(),
      createdBy: programYear.created_by,
      stageCount: programYear._count.stages,
      program: programYear.program
    };

    return NextResponse.json({ year: mappedYear });
  } catch (error) {
    console.error("Error fetching program year:", error);
    return NextResponse.json({ error: "Failed to fetch program year" }, { status: 500 });
  }
}


export async function PATCH(
  request: Request,
  { params }: { params: { programId: string; yearId: string } }
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

    const { yearId } = params;
    const data = await request.json();

    const y = await prisma.programYear.update({
      where: { id: yearId },
      data: {
        year: data.year ? parseInt(data.year) : undefined,
        label: data.label,
        description: data.description,
        start_date: data.startDate ? new Date(data.startDate) : undefined,
        end_date: data.endDate ? new Date(data.endDate) : undefined,
        status: data.status
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
      createdBy: y.created_by
    };

    return NextResponse.json({ year: mappedYear });
  } catch (error: any) {
    console.error("Error updating program year:", error);
    return NextResponse.json({ error: error.message || "Failed to update program year" }, { status: 500 });
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: { programId: string; yearId: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied. Only admins can delete program years." }, { status: 403 });
    }

    const { yearId } = params;

    await prisma.programYear.delete({
      where: { id: yearId }
    });

    return NextResponse.json({ message: "Program year deleted" });
  } catch (error: any) {
    console.error("Error deleting program year:", error);
    return NextResponse.json({ error: error.message || "Failed to delete program year" }, { status: 500 });
  }
}
