const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const authenticationService = require("../services/authentication.service");
const { AUTHENTICATION_ERRORS } = require("../constants/error");
const { USER } = require("../constants/schema");
const { logger } = require("../config/logger");

const authenticationController = {
  signUp: async (data) => {
    try {
      const {created, user} = await authenticationService.signUp(data);
      if (user.role === USER.ROLES[0]) {
        if(created) {
          return {
            message:
              "User registration successful! Kindly wait for admin to approve.",
            status: 200,
          };
        } else {
          if(user.status === USER.STATUS[0]) {
            return {
              message: "Your request is pending! Wait for the admin to approve!",
              status: 409
            }
          } else if (user.status === USER.STATUS[2]) {
            const twoDaysBefore = new Date();
            twoDaysBefore.setDate(twoDaysBefore.getDate() - 1);
            if(user.updatedAt > twoDaysBefore) {
              return {
                message: "Your request is rejected! You need to wait for 2 days before reapplying!",
                status: 409
              }
            } else {
              user.status = USER.STATUS[0];
              await user.save();
              return {
                message:
                  "User registration successful! Kindly wait for admin to approve.",
                status: 200,
              };
            }
          }
        }
      } else {
        user.status = "active";
        await user.save();
        return {
          message: `Welcome ${user.name}! Your registration is successful!`,
          status: 200,
        };
      }
    } catch (err) {
      if (err.message === AUTHENTICATION_ERRORS.USER_NOT_EXIST_IN_WALLET_DB) {
        return {
          message: `User with given data doesn't exist in wallet db`,
          status: 400,
        };
      } else if (err instanceof mongoose.Error.ValidationError) {
        return {
          message: err.message,
          status: 422,
        };
      } else if (err.name === "MongoServerError") {
        if (err.code === 11000) {
          return {
            message: `User already exists for the given data`,
            status: 400,
          };
        }
      } else {
        logger.error(err.message);
        return {
          message: "Something unexpected has happened! Try after some time!",
          status: 500,
        };
      }
    }
  },
  login: async (user) => {
    try {
      if (user.status === "pending") {
        return {
          message: "You are not yet approved by admin!",
          status: 401,
        };
      } else if (user.status === "rejected") {
        return {
          message:
            "You are signup is rejected by admin! Try signing up again after 2 days",
          status: 401,
        };
      }
      const token = jwt.sign(
        { id: user.employeeId, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
      );
      return {
        message: "Login successfull!",
        token: token,
        status: 200,
      };
    } catch (err) {
      return {
        message: "Something unexpected has happened! Try after some time!",
        status: 500,
      };
    }
  },
  getPendingApprovals: async () => {
    const pendingApprovalRequests =
      await authenticationService.pendingApprovals();
    return {
      requests: pendingApprovalRequests,
      status: 200,
    };
  },
  getPendingUser: async () => {
    const pendingUser =
      await authenticationService.getPendingUser();
    return {
      requests: pendingUser,
      status: 200,
    };
  },
  approveUser: async (employeeId) => {
    try {
      const response = await authenticationService.approveUser(employeeId);
      return response;
    } catch (err) {
      logger.error(err.message);
      return null;
    }
  },
  rejectUser: async (employeeId) => {
    try {
      const response = await authenticationService.rejectUser(employeeId);
      return response;
    } catch (err) {
      logger.error(err.message);
      return null;
    }
  },
  removeUser: async (employeeId) => {
    try {
      const response = await authenticationService.removeUser(employeeId);
      return response;
    } catch (err) {
      logger.error(err.message);
      return null;
    }
  },
};

module.exports = authenticationController;
