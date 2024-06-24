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
        next(new HTTPError(
          "Email or password is incorrect",
          StatusCodes.BAD_REQUEST
        ));
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  authenticationController.login
);

router.post("/signup", (req, res, next) => {
  /*  
    #swagger.tags = ['Auth']
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Add new user.',
      schema: { $ref: '#/definitions/AddUser' }
    } 
  */
  const signUpResponse = authenticationController.signUp(userData);

  signUpResponse
    .then((response) => {
      res.status(response.status).json(response);
    })
    .catch((err) => {
      next(err);
    });
});

router.get(
  "/pending",
  checkAuthentication(),
  checkRole(["admin"]),
  async (req, res, next) => {
    // #swagger.tags = ['Admin']
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    try {
      const pendingResponse =
        await authenticationController.getPendingApprovals();
      res.status(pendingResponse.status).json(pendingResponse);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/pending/:employeeId",
  checkAuthentication(),
  checkRole(["admin"]),
  async (req, res, next) => {
    // #swagger.tags = ['Admin']
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    try {
      const pendingResponse =
        await authenticationController.getPendingApprovals();
      res.status(pendingResponse.status).json(pendingResponse);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/pending/:employeeId/approve",
  checkAuthentication(),
  checkRole(["admin"]),
  authenticationController.approveUser
);

router.delete(
  "/pending/:employeeId",
  checkAuthentication(),
  checkRole(["admin"]),
  async (req, res) => {
    // #swagger.tags = ['Admin']
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
  }
);

module.exports = router;
