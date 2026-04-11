import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserById } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    // Auth check: Admin or Faculty
    const user = await getUserById(userId)
    if (!user || (user.role !== "FACULTY" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { course_id: courseId },
      include: {
        student: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }
      },
      orderBy: { enrolled_at: "desc" }
    })

    return NextResponse.json({ enrollments })
  } catch (error) {
    console.error("Fetch enrollments error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const user = await getUserById(userId)
    if (!user || (user.role !== "FACULTY" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const data = await request.json()
    const { enrollmentId, status, faculty_notes } = data

    if (!enrollmentId || !status) {
      return NextResponse.json({ error: "Enrollment ID and status are required" }, { status: 400 })
    }

    // Update enrollment status
    const enrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status,
        faculty_notes,
      },
      include: { course: true }
    })

    // If accepted, also sync to course_enrollments array (for backward compatibility)
    if (status === "ACCEPTED") {
      const course = enrollment.course
      if (!course.course_enrollments.includes(enrollment.student_id)) {
        await prisma.course.update({
          where: { id: course.id },
          data: {
            course_enrollments: {
              set: [...course.course_enrollments, enrollment.student_id]
            }
          }
        })
      }
    } else if (status === "REJECTED") {
        // Remove from course_enrollments if it was there
        const course = enrollment.course
        if (course.course_enrollments.includes(enrollment.student_id)) {
            await prisma.course.update({
                where: { id: course.id },
                data: {
                    course_enrollments: {
                        set: course.course_enrollments.filter(id => id !== enrollment.student_id)
                    }
                }
            })
        }
    }

    return NextResponse.json({ enrollment })
  } catch (error) {
    console.error("Update enrollment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
