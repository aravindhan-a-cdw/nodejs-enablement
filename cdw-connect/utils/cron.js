const cron = require("node-cron");
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
const cronTime = "30 17 13 * * *"; // 8 AM in IST

cron.schedule(
  cronTime,
  () => {
    dailyTask();
  },
  {
    scheduled: true,
    timezone: timeZone,
  }
);

logger.info("Cron job scheduled to run every day at 8 AM IST");
