import { prisma } from "../lib/prisma";

async function checkModels() {
  console.log("Prisma keys:", Object.keys(prisma).filter(k => !k.startsWith("_")));
  // @ts-ignore
  console.log("courseFeedback exists:", !!prisma.courseFeedback);
  // @ts-ignore
  console.log("course_feedback exists:", !!prisma.course_feedback);
}

checkModels().catch(console.error);
