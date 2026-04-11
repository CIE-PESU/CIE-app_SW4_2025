const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Step 1: Create the "Projects" domain
  console.log('=== Creating "Projects" domain ===')
  
  let projectsDomain = await prisma.domain.findFirst({ where: { name: "Projects" } })
  
  if (!projectsDomain) {
    projectsDomain = await prisma.domain.create({
      data: {
        name: "Projects",
        description: "Projects coordination and approval domain"
      }
    })
    console.log(`✓ Created "Projects" domain with ID: ${projectsDomain.id}`)
  } else {
    console.log(`✓ "Projects" domain already exists with ID: ${projectsDomain.id}`)
  }

  // Step 2: Assign Madhukar N as Projects coordinator
  // First, find Madhukar N's faculty record
  const madhukar = await prisma.faculty.findFirst({
    where: { user: { email: "cieoffice@pes.edu" } },
    include: { user: true, domain_assignments: { include: { domain: true } } }
  })

  if (!madhukar) {
    console.error('✗ Could not find Madhukar N faculty record')
    return
  }

  console.log(`\nFound faculty: ${madhukar.user.name} (${madhukar.user.email})`)
  console.log(`Current domain assignments: ${madhukar.domain_assignments.map(a => a.domain.name).join(', ')}`)

  // Check if already assigned
  const alreadyAssigned = madhukar.domain_assignments.some(a => a.domain_id === projectsDomain.id)
  
  if (!alreadyAssigned) {
    await prisma.domainCoordinator.create({
      data: {
        faculty_id: madhukar.id,
        domain_id: projectsDomain.id,
        assigned_by: madhukar.user_id
      }
    })
    console.log(`✓ Assigned ${madhukar.user.name} as Projects coordinator`)
  } else {
    console.log(`✓ ${madhukar.user.name} already assigned to Projects domain`)
  }

  // Step 3: Verify all domains and coordinators
  console.log('\n=== Final State: All Domains & Coordinators ===')
  const allCoordinators = await prisma.domainCoordinator.findMany({
    include: { 
      domain: true, 
      faculty: { include: { user: true } } 
    }
  })
  
  allCoordinators.forEach(c => {
    console.log(`  ${c.faculty.user.name} -> ${c.domain.name}`)
  })

  // Step 4: Verify projects can be approved
  console.log('\n=== Projects Pending Approval ===')
  const pendingProjects = await prisma.project.findMany({
    where: { status: "PENDING" },
    select: { id: true, name: true, status: true, type: true, created_by: true }
  })
  pendingProjects.forEach(p => {
    console.log(`  ${p.name}: status=${p.status}, type=${p.type}`)
  })
  
  console.log('\n=== Done! ===')
}

main().catch(console.error).finally(() => prisma.$disconnect())
