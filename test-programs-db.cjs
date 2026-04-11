const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.baseProgram.count();
    console.log("BaseProgram count:", count);
  } catch (e) {
    console.error("Error accessing baseProgram:", e.message);
  }
}

main().finally(() => prisma.$disconnect());
