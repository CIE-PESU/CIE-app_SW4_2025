import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserById } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { programId: string; yearId: string } }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Only students can enroll in programs" }, { status: 403 });
    }

    const student = await prisma.student.findUnique({
      where: { user_id: userId }
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const { yearId } = params;

    // Check if already enrolled
    const existing = await prisma.programEnrollment.findUnique({
      where: {
        year_id_student_id: {
          year_id: yearId,
          student_id: student.id
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "You are already enrolled in this program year" }, { status: 400 });
    }

    const enrollment = await prisma.programEnrollment.create({
      data: {
        year_id: yearId,
        student_id: student.id
      }
    });

    return NextResponse.json({ message: "Successfully enrolled", enrollment });
  } catch (error: any) {
    console.error("Error enrolling in program year:", error);
    return NextResponse.json({ error: error.message || "Failed to enroll in program year" }, { status: 500 });
  }
}
