const { logger } = require("../config/logger");
const profileService = require('../services/profile.service');

const getProfile = (req, res) => {
/* 
    #swagger.security = [{
        "bearerAuth": []
    }]
*/
    try{
        res.locals.responseData = {
            data: req.user
        }
    } catch (error) {
        next(error);
    }
    next();
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
        res.locals.responseData = {
            data: updatedUser
        }
    } catch (error) {
        next(error)
    }
    next();
};

module.exports = { getProfile, editProfile };
