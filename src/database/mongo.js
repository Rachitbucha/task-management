const { MongoClient } = require("mongodb");
let client;

async function connectToMongoDB() {
  try {
    const options = {
      maxPoolSize: parseInt(process.env.MONGO_DB_MAX_POOL_SIZE) || 10,
      wtimeoutMS: parseInt(process.env.MONGO_DB_WTIMEOUT_MS) || 2500,
      authSource: process.env.MONGO_DB_AUTH_SOURCE || "admin",
      readPreference: "primary",
      retryWrites: false,
      ssl: false,
      auth: {
        username: process.env.MONGO_DB_USER || "",
        password: process.env.MONGO_DB_PASSWORD || "",
      },
    };

    const url = `mongodb://${process.env.MONGO_DB_HOST || "localhost"}:${
      process.env.MONGO_DB_PORT || 27017
    }`;

    client = new MongoClient(url, options);
    await client.connect();
    console.log("Connected to MongoDB");
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit with failure
  }
}

async function getDatabase() {
  try {
    if (!client.isConnected()) {
      await connectToMongoDB();
    }
    return client.db(process.env.MONGO_DB_NAME || "task_management");
  } catch (error) {
    console.error("Error in Get Database.", error);
  }
}

module.exports = { connectToMongoDB, getDatabase };
