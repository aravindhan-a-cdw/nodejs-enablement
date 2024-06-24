const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { USER } = require("../constants/enum");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true, maxLength: 128 },
    email: { type: String, required: true, unique: true },
    employeeId: { type: String, required: true, unique: true },
    gender: { type: String, required: true, enum: USER.GENDER },
    profilePicture: { type: String },
    profileBio: { type: String },
    latestWorkDesignation: { type: String },
    certifications: { type: [String] },
    experience: { type: String },
    businessUnit: { type: String },
    workLocation: { type: String },
    status: {
      type: String,
      required: true,
      enum: USER.STATUS,
      default: USER.STATUS.PENDING,
    },
    role: {
      type: String,
      required: true,
      enum: USER.ROLES,
      default: USER.ROLES.USER,
    },
    password: { type: String, required: true },
  },
  {
    timestamps: true, // to add createdAt and updatedAt fields
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret._id;
        delete ret.status;
        delete ret.role;
        return ret;
      },
    },
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.index({ name: "text", latestWorkDesignation: "text" });

module.exports = mongoose.model("User", UserSchema);
