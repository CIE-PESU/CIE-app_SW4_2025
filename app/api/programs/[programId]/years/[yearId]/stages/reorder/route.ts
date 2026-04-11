import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserById } from "@/lib/auth";

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

    const { orderedIds } = await request.json();

    if (!orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "Invalid orderedIds" }, { status: 400 });
    }

    // Update orders in a transaction
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.programStage.update({
          where: { id },
          data: { order: index + 1 }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error reordering stages:", error);
    return NextResponse.json({ error: error.message || "Failed to reorder stages" }, { status: 500 });
  }
}
