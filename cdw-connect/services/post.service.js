const PostSchema = require("../models/post");

const getPosts = () => {
    return PostSchema.find().sort({$natural: 1});
}

module.exports = { getPosts }
