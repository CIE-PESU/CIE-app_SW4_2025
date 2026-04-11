import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Testing Course query...')
    const courses = await prisma.course.findMany({
      include: {
        enrollments: {
          include: {
            student: {
              include: {
                user: {
                  select: { name: true, email: true }
                }
              }
            }
          }
        },
        course_units: {
          orderBy: {
            unit_number: "asc"
          }
        }
      }
    })
    console.log('Successfully fetched', courses.length, 'courses')
  } catch (error) {
    console.error('Prisma Query Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
