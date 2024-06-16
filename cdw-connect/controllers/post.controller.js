const postService = require("../services/post.service");

const postController = {
  getPosts: async (req, res) => {
    const posts = await postService.getPosts();
    res.json({
      posts,
    });
  },
  getPost: async (req, res) => {
    const postId = req.params.postId;
    res.json({
      post: postId,
    });
  },
  createPost: async (req, res) => {
    /* 
            #swagger.security = [{
                    "bearerAuth": []
            }] 
            #swagger.parameters['body'] = {
                in: 'body',
                description: 'Add new user.',
                schema: { $ref: '#/definitions/AddUser' }
            }
    */
    res.json({
      message: "Post Created successfully",
    });
  },
  editPost: async (req, res) => {
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    res.json({
      message: "Post Edited successfully",
    });
  },
  deletePost: async (req, res) => {
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    res.json({
      message: "Post Deleted successfully",
    });
  },
  likePost: async (req, res) => {
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    res.json({
      message: "Post Liked successfully",
    });
  },
  commentPost: async (req, res) => {
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    res.json({
      message: "Post Commented successfully",
    });
  },
};

module.exports = postController;
