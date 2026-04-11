const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  // Check domains
  const domains = await p.domain.findMany()
  console.log('\n=== Domains ===')
  domains.forEach(d => console.log(`  ${d.name} (ID: ${d.id})`))

  // Check domain coordinators
  const coordinators = await p.domainCoordinator.findMany({
    include: { domain: true, faculty: { include: { user: true } } }
  })
  console.log('\n=== Domain Coordinators ===')
  coordinators.forEach(c => console.log(`  ${c.faculty.user.name} -> ${c.domain.name} (domain_id: ${c.domain_id})`))

  // Check projects and their statuses
  const projects = await p.project.findMany({ select: { id: true, name: true, status: true, type: true } })
  console.log('\n=== Projects ===')
  projects.forEach(pr => console.log(`  ${pr.name}: status=${pr.status}, type=${pr.type}`))
  
  // Check component requests
  const compReqs = await p.componentRequest.findMany()
  console.log(`\n=== Component Requests: ${compReqs.length} ===`)
  
  // Check library requests
  const libReqs = await p.libraryRequest.findMany()
  console.log(`=== Library Requests: ${libReqs.length} ===`)

  // Check library items sample
  const libItems = await p.libraryItem.findMany({ take: 3 })
  console.log('\n=== Library Items (sample) ===')
  libItems.forEach(i => console.log(`  ${i.item_name}: qty=${i.quantity}, avail=${i.available_quantity}, domain_id=${i.domain_id}`))

  // Check schema for RequestStatus enum
  console.log('\n=== RequestStatus values from schema ===')
  // Check what statuses are used
  const allStatuses = [...compReqs.map(r => r.status), ...libReqs.map(r => r.status)]
  const uniqueStatuses = [...new Set(allStatuses)]
  console.log(`  In use: ${uniqueStatuses.join(', ') || 'none'}`)
}

main().catch(console.error).finally(() => p.$disconnect())
