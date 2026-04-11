const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Check all coordinator assignments
  const assignments = await prisma.domainCoordinator.findMany({
    include: {
      faculty: { include: { user: true } },
      domain: true
    }
  })
  
  console.log("=== Current Coordinator Assignments ===")
  if (assignments.length === 0) {
    console.log("No coordinator assignments found!")
  } else {
    assignments.forEach(a => {
      console.log(`- ${a.faculty.user.name} (${a.faculty.user.email}) -> Domain: ${a.domain.name}`)
    })
  }
  
  // Check Madhukar N specifically
  console.log("\n=== Madhukar N Faculty Info ===")
  const madhukar = await prisma.user.findFirst({
    where: { name: { contains: 'Madhukar' } },
    include: { faculty: { include: { domain_assignments: { include: { domain: true } } } } }
  })
  if (madhukar) {
    console.log(`Found: ${madhukar.name} (${madhukar.email}), ID: ${madhukar.id}`)
    console.log(`Faculty ID: ${madhukar.faculty?.id}`)
    console.log(`Domain assignments: ${madhukar.faculty?.domain_assignments?.length || 0}`)
    madhukar.faculty?.domain_assignments?.forEach(da => {
      console.log(`  - ${da.domain.name} (domain_id: ${da.domain_id})`)
    })
  } else {
    console.log("Madhukar not found")
  }

  // List all domains
  console.log("\n=== All Domains ===")
  const domains = await prisma.domain.findMany()
  domains.forEach(d => console.log(`- ${d.name} (id: ${d.id})`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
