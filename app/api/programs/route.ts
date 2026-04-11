import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserById } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const programs = await prisma.baseProgram.findMany({
      include: {
        _count: {
          select: { years: true }
        }
      },
      orderBy: { created_at: "desc" }
    });

    const transformedPrograms = programs.map(p => ({
      ...p,
      yearCount: p._count.years,
      createdAt: p.created_at.toISOString()
    }));

    return NextResponse.json({ programs: transformedPrograms });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user || (user.role !== "ADMIN" && user.role !== "FACULTY")) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const data = await request.json();
    const { name, description, status } = data;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Check uniqueness
    const existing = await prisma.baseProgram.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json({ error: "Program name must be unique" }, { status: 400 });
    }

    const program = await prisma.baseProgram.create({
      data: {
        name,
        description,
        status: status || "active",
        created_by: userId
      }
    });

    return NextResponse.json({ program });
  } catch (error: any) {
    console.error("Error creating program:", error);
    return NextResponse.json({ error: error.message || "Failed to create program" }, { status: 500 });
  }
}
