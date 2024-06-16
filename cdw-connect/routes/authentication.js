const express = require("express");
const router = express.Router();
const passport = require("passport");
const authenticationController = require("../controllers/authentication.controller");
const {checkRole} = require('../middlewares/authentication.middleware');


router.post("/login", function (req, res, next) {
  // #swagger.tags = ['Auth']
  // #swagger.summary = "This is the route to login user"
  /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'User Login',
            schema: { $ref: '#/definitions/LoginUser' }
    } */
  passport.authenticate("local", { session: false }, async (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Email or password is incorrect!",
        status: 400,
      });
    }
    const response = await authenticationController.login(user);
    res.status(response.status).json(response);
  })(req, res, next);
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
  passport.authenticate("jwt", { session: false }),
  checkRole(['admin']),
  async (req, res, next) => {
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    try {
      const pendingResponse = await pendingApprovals();
      res.status(pendingResponse.status).json(pendingResponse);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/pending", () => {
  res.send("Approved the user");
});

module.exports = router;
