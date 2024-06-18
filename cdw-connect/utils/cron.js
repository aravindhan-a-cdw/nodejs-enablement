const cron = require("node-cron");
const moment = require("moment-timezone");
const { getWalletData } = require("../utils/walletData");
const User = require("../models/user");
const { logger } = require("../config/logger");

// Function to be executed daily
const dailyTask = async () => {
  logger.info("Running daily task at 8 AM IST:", new Date());
  const walletData = await getWalletData();
  const users = await User.find().exec();
  logger.debug(`Found ${users.length} users in db`);
  for (const dbUser of users) {
    const walletUser = walletData.find(
      (user) =>
        user.email === dbUser.email &&
        user.employeeId === dbUser.employeeId &&
        user.role == dbUser.role
    );
    if (walletUser === undefined) {
        logger.debug(`Deleting user ${dbUser.email} as data not found in wallet`);
      await dbUser.deleteOne();
    }
  }
};

// Calculate the time difference between IST and UTC
const timeZone = "Asia/Kolkata";
const cronTime = "0 8 * * *"; // 8 AM in IST

cron.schedule(
  cronTime,
  () => {
    const currentIST = moment.tz(timeZone).format();
    console.log("Current IST time:", currentIST);
    dailyTask();
  },
  {
    scheduled: true,
    timezone: timeZone,
  }
);

logger.info("Cron job scheduled to run every day at 8 AM IST");
