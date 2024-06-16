const UserModel = require("../models/user");
const {AUTHENTICATION_ERRORS} = require('../constants/error');
const { getWalletData } = require("../utils/walletData");
const { USER } = require("../constants/schema");

const pendingApprovals = async () => {
  const pendingUsers = await UserModel.find(
    {
      status: "pending",
    },
    "name email employeeId createdAt"
  ).exec();
  return pendingUsers;
};

const signUp = async (userData) => {
  const walletData = await getWalletData();
  const walletUser = walletData.find(
    (user) =>
      user.email === userData.email && user.employeeId === userData.employeeId && user.role == userData.role
  );
  if (walletUser === undefined) {
    throw new Error(AUTHENTICATION_ERRORS.USER_NOT_EXIST_IN_WALLET_DB);
  }

  const user = new UserModel(userData);
  const userInstance = await user.save();

  return userInstance;
};

const approveUser = async (employeeId) => {
  const user = await UserModel.findOneAndUpdate(
    {
      employeeId,
      status: USER.STATUS[0],
    },
    {
      status: USER.STATUS[1]
    }
  ).exec();
  if(user === null) {
    return false;
  }
  return true;
}

module.exports = { signUp, pendingApprovals, approveUser };
