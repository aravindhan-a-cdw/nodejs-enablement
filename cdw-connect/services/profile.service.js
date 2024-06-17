exports.editProfile = async (additionalData, user) => {
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
  for(const key of keys) {
    if(additionalData[key]) {
        user[key] = additionalData[key];
    }
  }
  await user.save();
  return user;
};
