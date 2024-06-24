const mongoose = require("mongoose");
const {logger} = require('../config/logger');

mongoose.set("strictQuery", false);

async function connect() {
  if (process.env.MONGO_DB_URL === undefined)
    throw new Error("MongoDB URL not set");
  await mongoose.connect(process.env.MONGO_DB_URL);
}

mongoose.connection.on('error', (err) => {
  logger.error(`Failed to connect to MongoDB: ${err.message}`);
});

module.exports = {connect}
