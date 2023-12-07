const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // const area = await prisma.area.findUnique({
  //   where: {
  //     id: 1
  //   },
  //   include: {
  //     projects: true,
  //   }
  // })
  // console.log(area)
  const areas = await prisma.area.findMany();
  console.log(areas);
  const projects = await prisma.project.findMany();
  console.log(projects)
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
