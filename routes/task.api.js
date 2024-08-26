const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createTask,
  getTask,
  getTaskById,
  assignTask,
  unassignTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controllers");

/**
 * @route GET api/tasks
 * @description Get list of tasks
 * @allowQueries: name, status
 */

router.get("/", getTask);

/**
 * @route POST api/tasks
 * @description Create task
 * @requiredBody: name, description
 */

const validateCreateTask = () => {
  return [
    body("name", "Task name cannot empty").notEmpty(),
    body("description", "Task description cannot empty").notEmpty(),
  ];
};

router.post("/", validateCreateTask(), createTask);

/**
 * @route GET api/tasks/:id
 * @description Get task by Id
 */

router.get("/:id", getTaskById);

/**
 * @route PUT api/tasks/assign/:id
 * @description Assign a task to a user
 */

router.put("/assign/:idUser/:idTask", assignTask);

/**
 * @route PUT api/tasks/unassign/:id
 * @description Unassign a task
 */

router.put("/unassign/:idUser/:idTask", unassignTask);

/**
 * @route PUT api/tasks/update/:id
 * @description Update task status by id
 * @requiredBody: status
 */

const validateStatus = () => {
  return body("status", "Status cannot be empty").notEmpty();
};

router.put("/update/:id", validateStatus(), updateTask);

/**
 * route PUT api/tasks/delete/:id
 * @description Delete task by id
 */

router.delete("/:id", deleteTask);

module.exports = router;
