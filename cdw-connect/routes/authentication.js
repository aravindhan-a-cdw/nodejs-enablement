const express = require("express");
const router = express.Router();
const passport = require("passport");
const authenticationController = require("../controllers/authentication.controller");
const { checkRole, checkAuthentication } = require("../middlewares/authentication.middleware");

router.post("/login", function (req, res, next) {
  // #swagger.tags = ['Auth']
  // #swagger.summary = "This is the route to login user"
  /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'User Login',
            schema: { $ref: '#/definitions/LoginUser' }
    } */
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: "Email or password is incorrect!",
          status: 400,
        });
      }
      const response = await authenticationController.login(user);
      res.status(response.status).json(response);
    }
  )(req, res, next);
});

router.post("/signup", (req, res, next) => {
  // #swagger.tags = ['Auth']
  /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add new user.',
            schema: { $ref: '#/definitions/AddUser' }
    } */
  const userData = req.body;
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
    // #swagger.tags = ['AuthApproval']
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
  "/approve/:employeeId",
  checkAuthentication(),
  checkRole(["admin"]),
  async (req, res) => {
    // #swagger.tags = ['AuthApproval']
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    const employeeId = req.params.employeeId;
    const approved = await authenticationController.approveUser(employeeId);
    if (approved === null) {
      return res.status(500).json({
        message: `Some unexpected error occurred!`,
        status: 500,
      });
    } else if (approved === false) {
      return res.status(404).json({
        message: `User with employeeId ${employeeId} not found in pending list!`,
        status: 404,
      });
    }
    res.json({
      message: `User request approved!`,
      status: 200,
    });
  }
);

module.exports = router;
