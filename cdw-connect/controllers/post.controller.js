const { logger } = require("../config/logger");
const postService = require("../services/post.service");

const postController = {
  getPosts: async (req, res, next) => {
    try {
      const filterBy = req.query.email;
      const posts = await postService.getPosts(filterBy);
      res.locals.responseData = {data: posts};
      next();
    } catch (error) {
      next(error);
    }
  },
  getPost: async (req, res) => {
    const postId = req.params.postId;
    const post = await postService.getPost(postId);
    res.json({
      data: post,
    });
  },
  createPost: async (req, res, next) => {
    /* 
            #swagger.security = [{
                    "bearerAuth": []
            }] 
            #swagger.parameters['body'] = {
                in: 'body',
                description: 'Create new post',
                schema: { $ref: '#/definitions/CreatePost' }
            }
    */
    const postData = req.body;
    try {
      const postInstance = await postService.createPost(postData, req.user);
      res.json({
        message: "Post Created successfully",
        data: postInstance,
      });
    } catch (err) {
      if (err.name === "MongoServerError") {
        if (err.code === 11000) {
          return res.status(400).json({
            message: `Post with given data already exists`,
            status: 400,
          });
        }
      }
      next(err);
    }
  },
  editPost: async (req, res, next) => {
    /* 
      #swagger.security = [{
              "bearerAuth": []
      }]
      #swagger.parameters['body'] = {
          in: 'body',
          description: 'Edit post',
          schema: { $ref: '#/definitions/CreatePost' }
      }
    */
    try {
      const postId = req.params.postId;
      const postData = req.body;
      const post = await postService.getPost(postId);
      if (post === null) {
        return res.status(404).json({
          message: "Not found!",
        });
      }
      if (post.createdBy.id !== req.user.id) {
        return res.status(403).json({
          message:
            "You are not allowed to edit this post! Users can only edit the post they have created!",
        });
      }
      const editedPost = await postService.editPost(post, postData);
      res.json({
        message: "Post Edited successfully",
        data: editedPost,
      });
    } catch (err) {
      if (err.name === "MongoServerError") {
        if (err.code === 11000) {
          return res.status(400).json({
            message: `Post with given data already exists`,
            status: 400,
          });
        }
      }
      next(err);
    }
  },
  deletePost: async (req, res) => {
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    try {
      const postId = req.params.postId;
      const post = await postService.getPost(postId);
      if (post === null) {
        return res.status(404).json({
          message: "Not found!",
        });
      }
      if (post.createdBy.id !== req.user.id) {
        return res.status(403).json({
          message:
            "You are not allowed to edit this post! Users can only edit the post they have created!",
        });
      }
      const editedPost = await postService.deletePost(postId);
      res.json({
        message: "Post Deleted successfully"
      });
    } catch (err) {
      next(err);
    }
  },
  likePost: async (req, res) => {
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
   const user = req.user;
   const postId = req.params.postId;
   const post = await postService.getPost(postId);
   if(post === null) {
    return res.status(404).json({
      message: "Post not found!"
    })
   }
    const liked = await postService.likePost(post, user);
    if(liked === null) {
      return res.status(409).json({
        message: "Post already liked"
      })
    }
    res.json({
      message: "Post Liked successfully",
      data: post.likes.length
    });
  },
  commentPost: async (req, res) => {
    /* 
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.parameters['body'] = {
          in: 'body',
          description: 'Add Comment',
          schema: { $ref: '#/definitions/CreateComment' }
      }
    */
   const post = await postService.getPost(req.params.postId);
   const commentData = req.body;
   const user = req.user;

   if(post === null) {
    return res.status(404).json({
      message: "Post not found!"
    })
   }

   await postService.addCommentToPost(commentData, post, user);

    res.json({
      message: "Post Commented successfully",
    });
  },
};

module.exports = postController;
