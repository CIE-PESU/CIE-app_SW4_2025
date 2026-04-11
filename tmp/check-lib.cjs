const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()
async function main() {
  const items = await p.libraryItem.findMany({
    select: { item_name: true, item_quantity: true, available_quantity: true }
  })
  console.log(JSON.stringify(items, null, 2))
  console.log(`Total: ${items.length} items`)
}
main().catch(console.error).finally(() => p.$disconnect())
