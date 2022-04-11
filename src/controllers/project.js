const express = require("express");
const Router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

Router.get("/all", async (req, res) => {
  const projects = await prisma.project.findMany({
    where: {
      logged: false,
      trash: false,
    }
  });
  res.json(projects);
});

Router.post("/add", async (req, res) => {
  const project = req.body.project;
  let newProject;
  try {
    newProject = await prisma.project.create({
      data: {
        ...project,
        date: project.date ? new Date(project.date) : null,
        deadline: project.deadline ? new Date(project.deadline) : null,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't add project" });
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
  let updatedProject;
  try {
    updatedProject = await prisma.todo.update({
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
  res.json({ updatedProject });
});

Router.put("/update", async (req, res) => {
  const project = req.body.project;
  if (!project) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  console.log(project);
  const projectId = project.id;
  delete project.id;
  let updatedProject;
  try {
    updatedProject = await prisma.project.update({
      where: {
        id: Number(projectId),
      },
      data: {
        ...project,
        date: project.date ? new Date(project.date) : null,
        deadline: project.deadline ? new Date(project.deadline) : null,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't update todo" });
  }
  res.json({ updatedProject });
});

Router.put("/delete", async (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    await prisma.project.update({
      where: {
        id: Number(id),
      },
      data: {
        trash: true,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't delete project" });
  }
  res.status(200).send();
});

module.exports = Router;
