const bcrypt = require("bcryptjs");
const { getDatabase } = require("../database/mongo");
const util = require("../utils/util");

async function register(email, password) {
  const db = await getDatabase();
  email = email.trim().toLowerCase();
  const existingUser = await db
    .collection(util.MONGO_COLLECTION_NAME.USER)
    .findOne({
      email,
      is_deleted: { $ne: true },
    });

  if (existingUser) {
    const err = new Error("User Already Exists!!!");
    err.status_code = 409;
    throw err;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = {
    email,
    password: hashedPassword,
    created_at: new Date(),
    updated_at: new Date(),
  };
  const insertResult = await db.collection("user").insertOne(user);

  if (!insertResult.acknowledged) {
    throw new Error("User Creation Failed, Please try after sometime!!!");
  }

  return util.getJwtToken(insertResult.insertedId.toString(), user.email);
}

async function login(email, password) {
  const db = await getDatabase();
  const user = await db.collection(util.MONGO_COLLECTION_NAME.USER).findOne({
    email: email.trim().toLowerCase(),
    is_deleted: { $ne: true },
  });

  if (!user) {
    const res = new Error("Email not found as registered user.");
    res.status_code = util.HTTP_STATUS_CODE.BAD_REQUEST;
    throw res;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const res = new Error("Invalid credentials.");
    res.status_code = util.HTTP_STATUS_CODE.BAD_REQUEST;
    throw res;
  }

  return util.getJwtToken(user._id.toString(), user.email);
}

module.exports = {
  register,
  login,
};
