const { logger } = require("../config/logger");
const UserModel = require("../models/user");
const profileService = require('../services/profile.service');
const { AUTHENTICATION_ERRORS } = require("../constants/error");
const { HTTPError } = require("../types/response");
const { StatusCodes } = require('http-status-codes');

const getProfile = (req, res, next) => {
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
    } catch(error) {
        next(error);
    }
    next();
};

const editProfileByAdmin = async (req, res, next) => {
    try{
        const profileData = req.body;
        const employeeId = req.params.employeeId;
        const user = await UserModel.findOne({employeeId: employeeId}).exec();
        if(user === null) {
            throw HTTPError(AUTHENTICATION_ERRORS.NO_USER_FOUND, StatusCodes.NOT_FOUND);
        }
        const updatedUser = await profileService.editProfile(profileData, user, true);
        res.locals.responseData = {
            data: updatedUser
        }
    } catch(error) {
        next(error);
    }
    next();
}

const getProfileAdmin = async (req, res, next) => {
    try{
        const employeeId = req.params.employeeId;
        const user = await UserModel.findOne({employeeId: employeeId}).exec();
        if(user === null) {
            throw HTTPError(AUTHENTICATION_ERRORS.NO_USER_FOUND, StatusCodes.NOT_FOUND);
        }
        res.locals.responseData = {
            data: user
        }
    } catch (error) {
        next(error);
    }
    next();
}

module.exports = { getProfile, editProfile, editProfileByAdmin, getProfileAdmin };
