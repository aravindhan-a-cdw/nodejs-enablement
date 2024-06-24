const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const authenticationService = require("../services/authentication.service");
const { AUTHENTICATION_ERRORS, LOGIN_ERRORS } = require("../constants/error");
const { USER } = require("../constants/enum");
const { logger } = require("../config/logger");
const { HTTPError } = require("../types/response");
const { StatusCodes } = require("http-status-codes");
const { AUTHENTICATION_MESSAGES } = require("../constants/success");

const authenticationController = {
  signUp: async (req, res, next) => {
    try {
      const userData = req.body;
      const user = await authenticationService.signUp(userData);
      if (user.role === USER.ROLES.ADMIN) {
        res.locals.responseData = {
          message: AUTHENTICATION_MESSAGES.SIGNUP_SUCCESS,
          status: StatusCodes.CREATED
        }
      } else {
        res.locals.responseData = {
          message: AUTHENTICATION_MESSAGES.ADMIN_SIGNUP_SUCCESS,
          status: StatusCodes.CREATED
        }
      }
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new HTTPError(err.message, StatusCodes.UNPROCESSABLE_ENTITY));
      } else if (err.name === "MongoServerError") {
        if (err.code === 11000) {
          next(new HTTPError(AUTHENTICATION_ERRORS.USER_ALREADY_EXISTS, StatusCodes.BAD_REQUEST));
        }
      }
      next(err);
    }
    next();
  },
  login: async (req, res, next) => {
    try {
      const user = req.user;
      if (user.status === USER.STATUS.PENDING) {
        throw new HTTPError(LOGIN_ERRORS.REQUEST_NOT_APPROVED, StatusCodes.BAD_REQUEST);
      } else if (user.status === USER.STATUS.PENDING) {
        throw new HTTPError(LOGIN_ERRORS.REQUEST_REJECTED_WAIT_2_DAYS, StatusCodes.BAD_REQUEST);
      } else if (user.status === USER.STATUS.INACTIVE) {
        throw new HTTPError(LOGIN_ERRORS.INACTIVE_USER, StatusCodes.BAD_REQUEST);
      }
      const token = jwt.sign(
        { id: user.employeeId, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
      );
      res.locals.responseData = {
        message: "Login successfull!",
        data: token,
        statusCode: 200,
      }
    } catch (err) {
      next(err);
    }
    next();
  },
  getPendingApprovals: async (req, res, next) => {
    try {
      const pendingApprovalRequests =
        await authenticationService.pendingApprovals();
      res.locals.responseData = {
        status: 200,
        data: pendingApprovalRequests,
      };
    } catch (error) {
      next(error);
    }
    next();
  },
  getPendingUser: async (req, res, next) => {
    try {
      const pendingUser = await authenticationService.getPendingUser();
      res.locals.responseData = {
        status: 200,
        data: pendingUser,
      };
    } catch (error) {
      next(error);
    }
    next();
  },
  approveUser: async (req, res, next) => {
    try {
      const employeeId = req.params.employeeId;
      const approveUser = req.body.approve;

      // Handled when approve is not provided in the body
      if (approveUser === undefined) {
        throw HTTPError(
          "Not able to process the data. Key 'approve' not found in body!",
          429
        );
      }

      // Approve or reject user
      if (approveUser) {
        await authenticationService.approveUser(employeeId);
      } else {
        await authenticationService.rejectUser(employeeId);
      }

      // Set response
      res.locals.responseData = {
        statusCode: 200,
        message: `User request has been successfully ${
          approveUser ? "approved" : "rejected"
        }!`,
      };
    } catch (error) {
      next(error);
    }
    next();
  },
  removeUser: async (req, res, next) => {
    try {
      const employeeId = req.params.employeeId;
      const response = await authenticationService.removeUser(employeeId);
      res.locals.responseData = {
        statusCode: 200,
        message: "User have been removed successfully!",
      };
    } catch (error) {
      next(error);
    }
    next();
  },
};

module.exports = authenticationController;
