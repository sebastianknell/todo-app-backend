const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // const newProject = await prisma.project.create({
  //   data: {
  //     name: "Home"
  //   }
  // })
  const newTodo = await prisma.todo.create({
    data: {
      title: "Buy soda 2",
      projectId: 5
    },
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
