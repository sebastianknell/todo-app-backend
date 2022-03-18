const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

app.get("/todo/all", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      completed: false,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  res.json(todos);
});

app.get("/todo/completed", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      completed: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  res.json(todos);
});

app.post("/todo/add", async (req, res) => {
  const todo = req.body.todo;
  if (todo) {
    // res.status(400).json({ error: "Invalid request body" });
    // return;
  }
  let newTodo;
  try {
    newTodo = await prisma.todo.create({
      data: {
        ...todo,
        date: todo.date ? new Date(todo.date) : null,
        deadline: todo.deadline ? new Date(todo.deadline) : null,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't add todo" });
  }
  res.json({ newTodo });
});

app.put("/todo/complete", async (req, res) => {
  const id = req.body.id;
  const completed = req.body.completed;
  if (id === undefined || completed === undefined) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  console.log(id);
  try {
    updatedTodo = await prisma.todo.update({
      where: {
        id: Number(id),
      },
      data: {
        completed: completed,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't update todo" });
  }
  res.json({ updatedTodo });
})

app.put("/todo/update", async (req, res) => {
  const todo = req.body.todo;
  if (!todo) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  console.log(todo);
  const todoId = todo.id;
  delete todo.id;
  let updatedTodo;
  // TODO update only changed fields
  try {
    updatedTodo = await prisma.todo.update({
      where: {
        id: Number(todoId),
      },
      data: {
        ...todo,
        date: todo.date ? new Date(todo.date) : null,
        deadline: todo.deadline ? new Date(todo.deadline) : null,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't update todo" });
  }
  res.json({ updatedTodo });
});

app.delete("/todo/delete", async (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    await prisma.todo.delete({
      where: {
        id: Number(id),
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't delete todo" });
  }
  res.status(200).send();
});

let port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
