const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

async function connect() {
  if (process.env.MONGO_DB_URL === undefined)
    throw new Error("MongoDB URL not set");
  await mongoose.connect(process.env.MONGO_DB_URL);
}

module.exports = {connect}
