const { logger } = require("../config/logger");
const profileService = require('../services/profile.service');

const getProfile = (req, res) => {
/* 
    #swagger.security = [{
        "bearerAuth": []
    }]
*/
    res.json(req.user);
};

const editProfile = async (req, res, next) => {
/* 
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Your additional information for your profile',
        schema: { $ref: '#/definitions/EditProfile' }
    }
*/
    try {
        const additionalData = req.body;
        const updatedUser = await profileService.editProfile(additionalData, req.user);
        res.json(updatedUser);
    } catch (err) {
        logger.error(err.message);
    }
};

module.exports = { getProfile, editProfile };
