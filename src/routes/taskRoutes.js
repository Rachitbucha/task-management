const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");
const { validateTask } = require("../validator/task.validator");

// GET all tasks
router.get("/", taskController.getAllTasks);

// GET a specific task by ID
router.get("/:task_id", taskController.getTaskById);

// CREATE a new task
router.post("/", validateTask, taskController.createTask);

// UPDATE a task by ID
router.put("/:task_id", taskController.updateTask);

// DELETE a task by ID
router.delete("/:task_id", taskController.deleteTask);

module.exports = router;
