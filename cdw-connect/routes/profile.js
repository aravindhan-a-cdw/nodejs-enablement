const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const { USER } = require("../constants/enum");
const {
  checkAuthentication,
  checkRole,
} = require("../middlewares/authentication.middleware");

router.get("/profile", checkAuthentication(), profileController.getProfile);
router.put("/profile", checkAuthentication(), profileController.editProfile);

router.get(
  "/profile/:employeeId",
  checkAuthentication(),
  checkRole([USER.ROLES.ADMIN]),
  /* 
    #swagger.tags = ['Admin']
    #swagger.security = [{
              "bearerAuth": []
}]
  */
 profileController.getProfileAdmin
);
router.put(
  "/profile/:employeeId",
  checkAuthentication(),
  checkRole([USER.ROLES.ADMIN]),
  /* 
    #swagger.tags = ['Admin']
    #swagger.security = [{
              "bearerAuth": []
    }]
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Your additional information for your profile',
        schema: { $ref: '#/definitions/EditProfile' }
    }
  */
  profileController.editProfileByAdmin
);

module.exports = router;
