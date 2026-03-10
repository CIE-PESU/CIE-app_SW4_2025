import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserById } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const user = await getUserById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    // Faculty/Admin can see all feedback for a course
    // Students can only see their own feedback (though the UI might not need this yet)
    const feedbacks = await prisma.courseFeedback.findMany({
      where: {
        course_id: courseId,
        ...(user.role === "STUDENT" ? { student_id: user.id } : {})
      },
      include: {
        student: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }
      },
      orderBy: {
        created_at: "desc"
      }
    })

    return NextResponse.json({ feedbacks })
  } catch (error) {
    console.error("Get feedback error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const user = await getUserById(userId)
    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Access denied - Students only" }, { status: 403 })
    }

    const data = await request.json()
    const { courseId, rating, comment } = data

    if (!courseId || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const studentId = user.profileData.id

    // Check if student is enrolled in the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { course_enrollments: true }
    })

    if (!course || !course.course_enrollments.includes(userId)) {
      return NextResponse.json({ error: "You must be enrolled in the course to give feedback" }, { status: 403 })
    }

    // Upsert feedback
    const feedback = await prisma.courseFeedback.upsert({
      where: {
        student_id_course_id: {
          student_id: studentId,
          course_id: courseId
        }
      },
      update: {
        rating,
        comment,
        updated_at: new Date()
      },
      create: {
        course_id: courseId,
        student_id: studentId,
        rating,
        comment
      }
    })

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Submit feedback error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
