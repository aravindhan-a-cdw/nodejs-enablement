const UserModel = require("../models/user");
const { AUTHENTICATION_ERRORS } = require("../constants/error");
const { getWalletData } = require("../utils/walletData");
const { USER } = require("../constants/enum");
const { HTTPError } = require("../types/response");
const { StatusCodes } = require("http-status-codes");

const pendingApprovals = async () => {
  const pendingUsers = await UserModel.find(
    {
      status: USER.STATUS.PENDING,
    },
    "employeeId"
  ).exec();
  return pendingUsers;
};

const getPendingUser = async (employeeId) => {
  const pendingUser = await UserModel.findOne(
    {
      employeeId: employeeId,
      status: USER.STATUS.PENDING,
    },
    "name email employeeId createdAt"
  ).exec();
  if (pendingUser === null) {
    throw new HTTPError("No pending user found for the given ID", 404);
  }
  return pendingUser;
};

const signUp = async (userData) => {
  const walletData = await getWalletData();
  // Check if user with given data exists in walletdb
  const walletUser = walletData.find(
    (user) =>
      user.email === userData.email &&
      user.employeeId === userData.employeeId &&
      user.role == userData.role
  );
  // Handle user not present in walletdb
  if (walletUser === undefined) {
    throw new HTTPError(
      AUTHENTICATION_ERRORS.USER_NOT_EXIST_IN_WALLET_DB,
      StatusCodes.NOT_FOUND
    );
  }
  // Check if there is an pending request from the user
  const pendingUser = await UserModel.findOne(
    {
      $or: [{ status: USER.STATUS.PENDING }, { status: USER.STATUS.REJECTED }],
      email: userData.email,
    },
    "name email role status employeeId createdAt updatedAt"
  ).exec();

  //
  if (pendingUser) {
    if (pendingUser.status === USER.STATUS.PENDING) {
      throw new HTTPError(
        AUTHENTICATION_ERRORS.PENDING_REQUEST_EXISTS,
        StatusCodes.CONFLICT
      );
    } else if (user.status === USER.STATUS.REJECTED) {
      const twoDaysBefore = new Date();
      twoDaysBefore.setDate(twoDaysBefore.getDate() - 1);
      if (user.updatedAt > twoDaysBefore) {
        throw new HTTPError(
          AUTHENTICATION_ERRORS.REQUEST_REJECTED_WAIT_2_DAYS,
          StatusCodes.CONFLICT
        );
      } else {
        pendingUser.status = USER.STATUS.PENDING;
        await pendingUser.save();
        return pendingUser;
      }
    }
  }
  const user = new UserModel(userData);
  // Set active status for admin alone and normal user is in pending state
  if(user.role === USER.ROLES.ADMIN) {
    user.status = USER.STATUS.ACTIVE;
  } else {
    user.status = USER.STATUS.PENDING;
  }
  const userInstance = await user.save();
  return userInstance;
};

const approveUser = async (employeeId) => {
  const user = await UserModel.findOneAndUpdate(
    {
      employeeId,
      status: USER.STATUS.PENDING,
    },
    {
      status: USER.STATUS.ACTIVE,
    }
  ).exec();
  if (user === null) {
    throw new HTTPError(
      AUTHENTICATION_ERRORS.NO_PENDING_USER_FOUND,
      StatusCodes.NOT_FOUND
    );
  }
  return true;
};

const rejectUser = async (employeeId) => {
  const user = await UserModel.findOneAndUpdate(
    {
      employeeId,
      status: USER.STATUS.PENDING,
    },
    {
      status: USER.STATUS.REJECTED,
    }
  ).exec();
  if (user === null) {
    throw new HTTPError(
      AUTHENTICATION_ERRORS.NO_PENDING_USER_FOUND,
      StatusCodes.NOT_FOUND
    );
  }
  return true;
};

const removeUser = async (employeeId) => {
  const user = await UserModel.findOneAndUpdate(
    {
      employeeId,
      status: USER.STATUS.ACTIVE,
    },
    {
      status: USER.STATUS.INACTIVE,
    }
  ).exec();
  if (user === null) {
    throw new HTTPError(
      AUTHENTICATION_ERRORS.NO_USER_FOUND,
      StatusCodes.NOT_FOUND
    );
  }
  return true;
};

module.exports = {
  signUp,
  pendingApprovals,
  getPendingUser,
  approveUser,
  rejectUser,
  removeUser,
};
