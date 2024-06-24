const { PostModel, CommentModel } = require("../models/post");

const filterByReferenceField = async (referencedFieldValue) => {
const excludedFields = ["gender", "certifications", "status", "role", "password", "createdAt", "updatedAt", "__v"]
  const results = await PostModel.aggregate([
    {
      $lookup: {
        from: "users", // The name of the referenced collection
        localField: "createdBy", // The local field containing the reference
        foreignField: "_id", // The foreign field in the referenced collection
        as: "user", // The name of the new array field containing the joined documents
      },
    },
    {
      $unwind: "$user", // Unwind the array to deconstruct the joined document
    },
    {
      $match: {
        "user.email": referencedFieldValue, // Match based on a field in the referenced document
      },
    },
    {
        $unset: excludedFields.reduce((acc, field) => {
          acc.push(`user.${field}`) // Exclude fields from the joined User document
          return acc;
        }, ['__v'])
      }
    // {
    //   $project: {
    //     "user.email": 1, // Include the fields you want in the result
    //     _id: 1,
    //     content: 1,

    //   },
    // },
  ]);
  return results;
};

const getPosts = (filter) => {
  if (filter === undefined) return PostModel.find().sort({ $natural: 1 });
  return filterByReferenceField(filter)
};

const getPost = (postId) => {
  return PostModel.findById(postId).populate({
    path: "createdBy",
    select: "name employeeId",
  });
};

const createPost = async (postData, user) => {
  const post = new PostModel(postData);
  post.createdBy = user.id;
  await post.save();
  await post.populate({ path: "createdBy", select: "name employeeId" });
  return post;
};

const editPost = async (post, postData) => {
  const fields = ["location", "link", "title", "caption"];
  for (const key of fields) {
    const data = postData[key];
    if (data !== undefined) {
      post[key] = data;
    }
  }
  await post.save();
  return post;
};

const deletePost = async (postId) => {
  const response = await PostModel.findByIdAndDelete(postId).exec();
  return response;
};

const likePost = async (post, user) => {
  const alreadyLiked = post.likes.find(
    (obj) => obj._id.toString() === user._id.toString()
  );
  if (alreadyLiked === undefined) {
    const response = post.likes.push(user._id);
    await post.save();
    return post;
  }
  return null;
};

const addCommentToPost = async (commentData, post, user) => {
  const comment = new CommentModel({ ...commentData, user: user._id });
  await comment.save();
  post.comments.push(comment._id);
  await post.save();
  return post;
};

module.exports = {
  getPosts,
  createPost,
  getPost,
  editPost,
  deletePost,
  likePost,
  addCommentToPost,
};
