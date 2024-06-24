const express = require("express");
const router = express.Router();
const passport = require("passport");
const authenticationController = require("../controllers/authentication.controller");
const {
  checkRole,
  checkAuthentication,
} = require("../middlewares/authentication.middleware");
const { HTTPError } = require("../types/response");
const { StatusCodes } = require("http-status-codes");

router.post(
  "/login",
  function (req, res, next) {
    // #swagger.tags = ['Auth']
    // #swagger.summary = "This is the route to login user"
    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'User Login',
            schema: { $ref: '#/definitions/LoginUser' }
    } */
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        next(
          new HTTPError(
            "Email or password is incorrect",
            StatusCodes.BAD_REQUEST
          )
        );
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  authenticationController.login
);

router.post(
  "/signup",
  /*  
    #swagger.tags = ['Auth']
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Add new user.',
      schema: { $ref: '#/definitions/AddUser' }
    } 
  */
  authenticationController.signUp
);

router.get(
  "/pending",
  checkAuthentication(),
  checkRole(["admin"]),
  /* 
    #swagger.tags = ['Admin']
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  authenticationController.getPendingApprovals
);

router.get(
  "/pending/:employeeId",
  checkAuthentication(),
  checkRole(["admin"]),
  /* 
    #swagger.tags = ['Admin']
    #swagger.security = [{
              "bearerAuth": []
    }] 
  */
  authenticationController.getPendingUser
);

router.post(
  "/pending/:employeeId/approve",
  checkAuthentication(),
  checkRole(["admin"]),
  /* 
    #swagger.tags = ['Admin']
    #swagger.security = [{
              "bearerAuth": []
    }] 
  */
  authenticationController.approveUser
);

router.delete(
  "/pending/:employeeId",
  checkAuthentication(),
  checkRole(["admin"]),
  /* 
    #swagger.tags = ['Admin']
    #swagger.security = [{
      "bearerAuth": []
    }] 
  */
  authenticationController.removeUser
);

module.exports = router;
