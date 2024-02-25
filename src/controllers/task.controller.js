const {
  HTTP_STATUS_CODE,
  sendErrorResponse,
  MONGO_COLLECTION_NAME,
} = require("../utils/util");

const { getDatabase } = require("../database/mongo");
const { ObjectId } = require("mongodb");

// GET all tasks
async function getAllTasks(req, res) {
  try {
    const db = await getDatabase();
    const tasks = await db
      .collection(MONGO_COLLECTION_NAME.TASK)
      .find({
        user_id: req.user_profile.user_id,
        is_deleted: { $ne: true },
      })
      .toArray();
    res.json(tasks);
  } catch (error) {
    return sendErrorResponse(res, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}

// GET a specific task by ID
async function getTaskById(req, res) {
  try {
    const db = await getDatabase();

    const taskId = req.params.task_id?.trim();
    if (!taskId) {
      const err = new Error("Invalid task Id.");
      err.status_code = HTTP_STATUS_CODE.BAD_REQUEST;
      throw err;
    }

    const task = await db.collection(MONGO_COLLECTION_NAME.TASK).findOne({
      _id: new ObjectId(taskId),
      user_id: req.user_profile.user_id,
      is_deleted: { $ne: true },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json(task);
  } catch (error) {
    return sendErrorResponse(res, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}

// CREATE a new task
async function createTask(req, res) {
  try {
    const { title, description, due_date, status } = req.body;
    const task = {
      title,
      description,
      due_date,
      status,
      user_id: req.user_profile.user_id,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const db = await getDatabase();
    await db.collection(MONGO_COLLECTION_NAME.TASK).insertOne(task);
    res.status(HTTP_STATUS_CODE.CREATED).json(task);
  } catch (error) {
    return sendErrorResponse(res, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}

// UPDATE a task by ID
async function updateTask(req, res) {
  const { title, description, due_date, status } = req.body;

  try {
    const db = await getDatabase();

    const taskId = req.params.task_id?.trim();
    if (!taskId) {
      const err = new Error("Invalid task Id.");
      err.status_code = HTTP_STATUS_CODE.BAD_REQUEST;
      throw err;
    }

    let task = await db.collection(MONGO_COLLECTION_NAME.TASK).findOne({
      _id: new ObjectId(taskId),
      user_id: req.user_profile.user_id,
      is_deleted: { $ne: true },
    });

    if (!task) {
      return sendErrorResponse(
        res,
        HTTP_STATUS_CODE.NOT_FOUND,
        "Task not found."
      );
    }

    let updateReq = {};

    if (title?.toString().trim().length > 0) {
      updateReq.title = title;
    }

    if (description?.toString().trim().length > 0) {
      updateReq.description = description;
    }

    if (due_date) {
      updateReq.due_date = new Date(due_date);
    }

    if (status?.toString().trim().length > 0) {
      updateReq.status = status;
    }

    if (Object.keys(updateReq).length === 0) {
      const err = new Error("No changes found for update.");
      err.status_code = HTTP_STATUS_CODE.NOT_MODIFIED;
      throw err;
    }

    updateReq.updated_at = new Date();

    await db.collection(MONGO_COLLECTION_NAME.TASK).updateOne(
      { _id: new ObjectId(taskId), user_id: req.user_profile.user_id },
      {
        $set: updateReq,
      }
    );
    res.json({ ...task, ...updateReq });
  } catch (error) {
    return sendErrorResponse(res, error.status_code, error.message);
  }
}

// DELETE a task by ID
async function deleteTask(req, res) {
  try {
    const db = await getDatabase();

    const taskId = req.params.task_id?.trim();
    if (!taskId) {
      const err = new Error("Invalid task Id.");
      err.status_code = HTTP_STATUS_CODE.BAD_REQUEST;
      throw err;
    }

    const task = await db.collection(MONGO_COLLECTION_NAME.TASK).findOne({
      _id: new ObjectId(taskId),
      user_id: req.user_profile.user_id,
      is_deleted: { $ne: true },
    });

    if (!task) {
      return res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ message: "Task not found." });
    }

    // Soft Delete
    await db.collection(MONGO_COLLECTION_NAME.TASK).updateOne(
      { _id: new ObjectId(taskId), user_id: req.user_profile.user_id },
      {
        $set: { is_deleted: true },
      }
    );

    res.json({ message: "Task deleted." });
  } catch (error) {
    return sendErrorResponse(res, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
