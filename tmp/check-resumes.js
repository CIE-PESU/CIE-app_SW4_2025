import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const students = await prisma.student.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          id: true
        }
      }
    }
  })
  
  console.log('Students status:')
  students.forEach(s => {
    console.log(`- ${s.user.name} (${s.user.email}) [UserID: ${s.user.id}]: resume_id=${s.resume_id}, resume_path=${s.resume_path}`)
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
