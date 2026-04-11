const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  const courses = await p.course.findMany({
    include: { course_units: true, feedbacks: { include: { student: { include: { user: true } } } } }
  })
  
  courses.forEach(co => {
    console.log(`\nCourse: ${co.course_name} (${co.course_code}) ID: ${co.id}`)
    co.course_units.forEach(u => console.log(`  Unit ${u.unit_number}: ${u.unit_name} (ID: ${u.id})`))
    console.log(`  Feedbacks: ${co.feedbacks.length}`)
    co.feedbacks.forEach(f => {
      console.log(`    - Student: ${f.student?.user?.name || 'N/A'}, Unit: ${f.unit_id}, Rating: ${f.rating}, Comment: ${f.comment.substring(0, 60)}...`)
    })
  })

  // Also list students
  const students = await p.student.findMany({ include: { user: true } })
  console.log('\n=== Students ===')
  students.forEach(s => console.log(`  ${s.user.name} (${s.user.email}) ID: ${s.id}, student_id: ${s.student_id}`))
}

main().catch(console.error).finally(() => p.$disconnect())
