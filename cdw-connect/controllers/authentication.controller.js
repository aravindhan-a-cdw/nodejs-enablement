const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const authenticationService = require("../services/authentication.service");
const { AUTHENTICATION_ERRORS } = require("../constants/error");
const { USER } = require("../constants/schema");

const authenticationController = {
  signUp: async (data) => {
    try {
      const userInstance = await authenticationService.signUp(data);
      if(userInstance.role === USER.ROLES[0]) {
        return {
          message:
            "User registration successful! Kindly wait for admin to approve.",
          status: 200,
        };
      } else {
        userInstance.status = "active";
        await userInstance.save();
        return {
          message:
            `Welcome ${userInstance.name}! Your registration is successful!`,
          status: 200,
        };
      }
    } catch (err) {
      if ((err.message === AUTHENTICATION_ERRORS.USER_NOT_EXIST_IN_WALLET_DB)) {
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
    const pendingApprovalRequests = authenticationService.pendingApprovals();
    return {
      requests: pendingApprovalRequests,
      status: 200
    }
  }
};

module.exports = authenticationController;
