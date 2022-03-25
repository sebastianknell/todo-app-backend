const express = require("express");
const Router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

Router.get("/all", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      logged: false,
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
    },
    orderBy: {
      completedAt: "asc",
    },
  });
  res.json(todos);
});

Router.get("/deleted", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      trash: true,
    },
    orderBy: {
      updatedAt: "asc",
    },
  });
  res.json(todos);
});

Router.post("/add", async (req, res) => {
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

Router.put("/complete", async (req, res) => {
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

Router.put("/log", async (req, res) => {
  try {
    await prisma.todo.updateMany({
      where: {
        completed: true,
        logged: false,
      },
      data: {
        logged: true,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't log todos" });
  }
  res.status(200).send();
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

Router.delete("/empty", async (req, res) => {
  try {
    await prisma.todo.deleteMany({
      where: {
        trash: true,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't empty trash" });
  }
  res.status(200).send();
});

module.exports = Router;
