const express = require("express");
const Router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

Router.get("/all", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      logged: false,
      trash: false,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  res.json(todos);
});

Router.get("/completed", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      logged: true,
      trash: false,
    },
    orderBy: {
      completedAt: "asc",
    },
  });
  res.json(todos);
});

Router.post("/add", async (req, res) => {
  const todo = req.body.todo;
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

Router.put("/complete", async (req, res) => {
  const id = req.body.id;
  const completed = req.body.completed;
  if (id === undefined || completed === undefined) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  console.log(id);
  let updatedTodo;
  try {
    updatedTodo = await prisma.todo.update({
      where: {
        id: Number(id),
      },
      data: {
        completed: completed,
        logged: !completed ? true : false,
        completedAt: completed ? new Date() : null,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't update todo" });
  }
  res.json({ updatedTodo });
});

Router.put("/update", async (req, res) => {
  const todo = req.body.todo;
  if (!todo) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  console.log(todo);
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

Router.put("/delete", async (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    await prisma.todo.update({
      where: {
        id: Number(id),
      },
      data: {
        trash: true,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't delete todo" });
  }
  res.status(200).send();
});

module.exports = Router;
