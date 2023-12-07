const express = require("express");
const cors = require("cors");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const areaController = require("./controllers/area");
const projectController = require("./controllers/project");
const todoController = require("./controllers/todo");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

app.use("/area", areaController);
app.use("/project", projectController);
app.use("/todo", todoController);

app.put("/log", async (req, res) => {
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
    await prisma.project.updateMany({
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
    res.status(500).json({ error: "Couldn't log items" });
  }
  res.status(200).send();
});

app.get("/deleted", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      trash: true,
    },
    orderBy: {
      updatedAt: "asc",
    },
  });
  const projects = await prisma.project.findMany({
    where: {
      trash: true,
    },
    orderBy: {
      updatedAt: "asc",
    },
  });
  res.json({ todos: todos, projects: projects });
});

app.delete("/empty", async (req, res) => {
  try {
    await prisma.todo.deleteMany({
      where: {
        trash: true,
      },
    });
    await prisma.project.deleteMany({
      where: {
        trash: true,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Couldn't empty trash" });
  }
  res.status(200).send();
});

// prueba software 2
app.get("/keepalive", (req, res) => {
  res.status(200).send();
})

app.get("/keepalive_db", async (req, res) => {
  try {
    await prisma.area.findFirst();
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Database did not respond" });
  }
  res.status(200).send();
})

let port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
