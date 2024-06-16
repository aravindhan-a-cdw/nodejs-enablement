const UserModel = require("../models/user");
const {AUTHENTICATION_ERRORS} = require('../constants/error');
const { getWalletData } = require("../utils/walletData");

const pendingApprovals = async () => {
  const pendingUsers = await UserModel.find(
    {
      status: "pending",
    },
    "name email employeeId createdAt"
  ).exec();
  return {
    users: pendingUsers,
    status: 200,
  };
};

const signUp = async (userData) => {
  const walletData = await getWalletData();
  const walletUser = walletData.find(
    (user) =>
      user.email === userData.email && user.employeeId === userData.employeeId
  );
  if (walletUser === undefined) {
    throw new Error(AUTHENTICATION_ERRORS.USER_NOT_EXIST_IN_WALLET_DB);
  }

  const user = new UserModel(userData);
  const userInstance = await user.save();

  return userInstance;
};

module.exports = { signUp, pendingApprovals };
