exports.editProfile = async (additionalData, user, admin = false) => {
  const keys = [
    "name",
    "gender",
    "profilePicture",
    "profileBio",
    "latestWorkDesignation",
    "certifications",
    "experience",
    "businessUnit",
    "workLocation",
  ];
  if(admin) {
    keys.push("email", "password");
  }
  for(const key of keys) {
    if(additionalData[key]) {
        user[key] = additionalData[key];
    }
  }
  await user.save();
  return user;
};
