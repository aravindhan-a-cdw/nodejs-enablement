const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { checkAuthentication } = require('../middlewares/authentication.middleware');

router.get('/profile', checkAuthentication(), profileController.getProfile);
router.put('/profile', checkAuthentication(), profileController.editProfile);

module.exports = router;