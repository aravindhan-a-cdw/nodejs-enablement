const { logger } = require("../config/logger");
const { HTTPError } = require("../types/response");
const { StatusCodes } = require("http-status-codes");
const postService = require("../services/post.service");

const postController = {
  getPosts: async (req, res, next) => {
    try {
      const filterBy = req.query.email;
      const posts = await postService.getPosts(filterBy);
      res.locals.responseData = { data: posts };
    } catch (error) {
      next(error);
    }
    next();
  },
  getPost: async (req, res, next) => {
    try {
      const postId = req.params.postId;
      const post = await postService.getPost(postId);
      res.locals.responseData = { data: post };
    } catch (error) {
      next(error);
    }
    next();
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
    try {
      const postData = req.body;
      const postInstance = await postService.createPost(postData, req.user);
      res.locals.responseData = {
        data: postInstance,
        message: "Post Created successfully",
      };
    } catch (err) {
      if (err.name === "MongoServerError") {
        if (err.code === 11000) {
          next(
            new HTTPError(
              "Post with given data already exists",
              StatusCodes.BAD_REQUEST
            )
          );
        }
      }
      next(err);
    }
    next();
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
        throw new HTTPError(
          "No post found for the given id",
          StatusCodes.NOT_FOUND
        );
      }
      if (post.createdBy.id !== req.user.id) {
        throw new HTTPError(
          "You are not allowed to edit this post! Users can only edit their post!",
          StatusCodes.FORBIDDEN
        );
      }
      const editedPost = await postService.editPost(post, postData);
      res.locals.responseData = {
        data: editedPost,
        message: "Post Edited successfully",
      };
    } catch (err) {
      if (err.name === "MongoServerError") {
        if (err.code === 11000) {
          return next(
            new HTTPError(
              "Post with given data already exists",
              StatusCodes.BAD_REQUEST
            )
          );
        }
      }
      next(err);
    }
    next();
  },
  deletePost: async (req, res, next) => {
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    try {
      const postId = req.params.postId;
      const post = await postService.getPost(postId);
      if (post === null) {
        throw new HTTPError(
          "No post found for the given id",
          StatusCodes.NOT_FOUND
        );
      }
      if (post.createdBy.id !== req.user.id) {
        throw new HTTPError(
          "You are not allowed to delete this post! Users can only delete their post!",
          StatusCodes.FORBIDDEN
        );
      }
      await postService.deletePost(postId);
      res.locals.responseData = {
        message: "Post deleted successfully",
      };
    } catch (err) {
      next(err);
    }
    next();
  },
  likePost: async (req, res, next) => {
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    try {
      const user = req.user;
      const postId = req.params.postId;
      const post = await postService.getPost(postId);
      if (post === null) {
        throw new HTTPError(
          "No post found for the given id",
          StatusCodes.NOT_FOUND
        );
      }
      const liked = await postService.likePost(post, user);
      if (liked === null) {
        throw new HTTPError(
          "You have already liked this post",
          StatusCodes.CONFLICT
        );
      }
      res.locals.responseData = {
        message: "Post Liked successfully",
        data: { likes: post.likes.length },
      };
    } catch (error) {
      next(error);
    }
    next();
  },
  commentPost: async (req, res, next) => {
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
    try {
      const post = await postService.getPost(req.params.postId);
      const commentData = req.body;
      const user = req.user;

      if (post === null) {
        throw new HTTPError(
          "No post found for the given id",
          StatusCodes.NOT_FOUND
        );
      }
      await postService.addCommentToPost(commentData, post, user);
      res.locals.responseData = {
        message: "Post Commented successfully",
      };
    } catch (error) {
      next(error);
    }
    next();
  },
};

module.exports = postController;
