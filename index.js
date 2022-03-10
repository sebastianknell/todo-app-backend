const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // const newProject = await prisma.project.create({
  //   data: {
  //     name: "Home"
  //   }
  // })
  // const newTodo = await prisma.todo.create({
  //   data: {
  //     title: "Test todo",
  //   },
  // });
  // console.log(newTodo)
  const todo = await prisma.todo.findUnique({
    where: {
      id: 24
    }
  });
  console.log(todo.createdAt)
  console.log(new Date(todo.createdAt).toLocaleDateString('en-CA'))
  console.log(todo.updatedAt)
  console.log(new Date(todo.updatedAt).toLocaleDateString())
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
