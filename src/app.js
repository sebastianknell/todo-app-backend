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
      logged: false,
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
      logged: true,
    },
    orderBy: {
      completedAt: "asc",
    },
  });
  res.json(todos);
});

app.get("/todo/deleted", async (req, res) => {
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
        logged: !completed ? true : false,
        completedAt: completed ? new Date() : null
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

app.put("/todo/log", async (req, res) => {
  try {
    await prisma.todo.updateMany({
      where: {
        completed: true,
        logged: false,
      },
      data: {
        logged: true
      }
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't log todos" });
  }
  res.status(200).send();
})

app.put("/todo/delete", async (req, res) => {
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
      }
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't delete todo" });
  }
  res.status(200).send();
});

app.delete("/todo/empty", async (req, res) => {
  try {
    await prisma.todo.deleteMany({
      where: {
        trash: true,
      }
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't empty trash" });
  }
  res.status(200).send();
})

let port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
