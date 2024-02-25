require("dotenv").config();
const express = require("express");
const app = express();
const { connectToMongoDB } = require("../src/database/mongo");
const authRoutes = require("./routes/authRoutes");
const { userTokenMiddleWare } = require("./middleware/auth");
const taskRoutes = require("./routes/taskRoutes");
const { HTTP_STATUS_CODE } = require("./utils/util");

//Middleware
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
    .send("Internal Server Error");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", userTokenMiddleWare, taskRoutes);

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectToMongoDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("Unable to Start Server...", error);
  }
}

startServer();
