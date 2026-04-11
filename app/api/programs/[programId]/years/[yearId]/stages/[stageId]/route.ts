import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserById } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { programId: string; yearId: string; stageId: string } }
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

    const { stageId } = params;
    const data = await request.json();
    const { name, description, startDate, endDate, status } = data;

    const s = await prisma.programStage.update({
      where: { id: stageId },
      data: {
        name,
        description,
        start_date: startDate ? new Date(startDate) : null,
        end_date: endDate ? new Date(endDate) : null,
        status
      }
    });

    const mappedStage = {
      id: s.id,
      yearId: s.year_id,
      programId: s.program_id,
      name: s.name,
      description: s.description || undefined,
      order: s.order,
      startDate: s.start_date?.toISOString(),
      endDate: s.end_date?.toISOString(),
      status: s.status as any,
      createdAt: s.created_at.toISOString(),
      createdBy: s.created_by
    };

    return NextResponse.json({ stage: mappedStage });
  } catch (error: any) {
    console.error("Error updating program stage:", error);
    return NextResponse.json({ error: error.message || "Failed to update program stage" }, { status: 500 });
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: { programId: string; yearId: string; stageId: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can delete stages" }, { status: 403 });
    }

    const { yearId, stageId } = params;

    // Use a transaction to delete and reorder
    await prisma.$transaction(async (tx) => {
      const stageToDelete = await tx.programStage.findUnique({
        where: { id: stageId }
      });

      if (!stageToDelete) return;

      await tx.programStage.delete({
        where: { id: stageId }
      });

      // Reorder remaining stages
      const remainingStages = await tx.programStage.findMany({
        where: { year_id: yearId },
        orderBy: { order: "asc" }
      });

      for (let i = 0; i < remainingStages.length; i++) {
        await tx.programStage.update({
          where: { id: remainingStages[i].id },
          data: { order: i + 1 }
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting program stage:", error);
    return NextResponse.json({ error: error.message || "Failed to delete program stage" }, { status: 500 });
  }
}
