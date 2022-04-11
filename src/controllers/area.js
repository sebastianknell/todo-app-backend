const express = require("express");
const Router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

Router.get("/all", async (req, res) => {
  const areas = await prisma.area.findMany();
  res.json(areas);
});

Router.post("/add", async (req, res) => {
  const area = req.body.area;
  let newArea;
  try {
    newArea = await prisma.area.create({
      data: {
        ...area,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't add area" });
  }
  res.json({ newTodo });
});

Router.put("/update", async (req, res) => {
  const area = req.body.area;
  if (!area) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  console.log(area);
  const areaId = area.id;
  delete area.id;
  let updatedArea;
  try {
    updatedArea = await prisma.area.update({
      where: {
        id: Number(todoId),
      },
      data: {
        ...area,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't update todo" });
  }
  res.json({ updatedArea });
});

Router.delete("/delete", async (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    await prisma.area.delete({
      where: {
        id: Number(id),
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Couldn't delete area" });
  }
  res.status(200).send();
});

module.exports = Router;