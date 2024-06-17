const UserModel = require("../models/user");
const { PostModel } = require("../models/post");

exports.search = async (query) => {
  const regexQuery = new RegExp(String.raw`${query}`, "i");
  const users = await UserModel.find({
    $or: [
        {name: regexQuery},
        {latestWorkDesignation: regexQuery}
    ]
  }, '-__v -createdAt -updatedAt').exec();
  const posts = await PostModel.find({
    $or: [
        {title: regexQuery},
        {location: regexQuery},
        {caption: regexQuery}
    ]
  }, '-__v -createdAt -updatedAt').exec();
  return {
    users,
    posts,
  };
};
