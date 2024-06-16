const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

router.get('/post', postController.getPosts);
router.post('/post', postController.createPost);
router.get('/post/:postId', postController.getPost);
router.put('/post/:postId', postController.editPost);
router.delete('/post/:postId', postController.deletePost);
router.post('/post/:postId/like', postController.likePost);
router.post('/post/:postId/comment', postController.commentPost);


module.exports = router;