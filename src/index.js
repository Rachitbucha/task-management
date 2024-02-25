require("dotenv").config();
const express = require("express");
const app = express();
const { connectToMongoDB } = require("../src/database/mongo");
const authRoutes = require("./routes/authRoutes");

//Middleware
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Routes
app.use("/api/auth", authRoutes);

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
