const mongoose = require('mongoose');
const {USER} = require('../constants/schema')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String, required: true, maxLength: 128},
    email: {type: String, required: true, unique: true},
    employeeId: {type: Number, required: true, unique: true},
    gender: {type: String, required: true, enum: USER.GENDER},
    profilePicture: {type: String, },
    profileBio: {type: String},
    latestWorkDesignation: {type: String},
    certifications: {type: String},
    experience: {type: Number},
    businessUnit: {type: String,},
    workLocation: {type: String},
    status: {type: String, required: true, enum: USER.STATUS, default: USER.STATUS[0]},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("User", UserSchema);