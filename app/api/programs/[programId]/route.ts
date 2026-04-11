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

    const program = await prisma.baseProgram.findUnique({
      where: { id: programId },
      include: {
        _count: {
          select: { years: true }
        }
      }
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({
      program: {
        ...program,
        yearCount: program._count.years,
        createdAt: program.created_at.toISOString()
      }
    });
  } catch (error) {
    console.error("Error fetching program:", error);
    return NextResponse.json({ error: "Failed to fetch program" }, { status: 500 });
  }
}

export async function PATCH(
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

    const program = await prisma.baseProgram.update({
      where: { id: programId },
      data: {
        name: data.name,
        description: data.description,
        status: data.status
      }
    });

    return NextResponse.json({ program });
  } catch (error: any) {
    console.error("Error updating program:", error);
    return NextResponse.json({ error: error.message || "Failed to update program" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { programId: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied. Only admins can archive/delete programs." }, { status: 403 });
    }

    const { programId } = params;

    // We can either delete or update status to archived. User said "Archive/delete a base program". 
    // I'll update status to archived as it's safer, but I'll allow full deletion if requested. 
    // Requirement says status: "archived".
    
    const program = await prisma.baseProgram.update({
      where: { id: programId },
      data: { status: "archived" }
    });

    return NextResponse.json({ message: "Program archived", program });
  } catch (error: any) {
    console.error("Error archiving program:", error);
    return NextResponse.json({ error: error.message || "Failed to archive program" }, { status: 500 });
  }
}
