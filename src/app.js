const express = require("express");
const cors = require("cors")
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const port = 3000;
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

app.get("/todo/all", async (req, res) => {
  const todos = await prisma.todo.findMany();
  res.json(todos);
});

app.post("/todo/add", async (req, res) => {
  const todo = req.body.todo;
  if (!todo || !todo.title) {
    res.status(400).json({ error: "Invalid request body" });
  }
  let newTodo;
  try {
    newTodo = await prisma.todo.create({
      data: todo,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't add todo" });
  }
  res.json({ newTodo });
});

app.put("/todo/update", async (req, res) => {
  const todo = req.body.todo;
  const todoId = todo.id;
  delete todo.id;
  let updatedTodo;
  try {
    updatedTodo = await prisma.todo.update({
      where: {
        id: Number(todoId),
      },
      data: {
        ...todo,
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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
