const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { checkAuthentication } = require('../middlewares/authentication.middleware');

router.get('/post', postController.getPosts);
router.post('/post', checkAuthentication(), postController.createPost);
router.get('/post/:postId', postController.getPost);
router.put('/post/:postId', checkAuthentication(), postController.editPost);
router.delete('/post/:postId', checkAuthentication(), postController.deletePost);
router.post('/post/:postId/like', checkAuthentication(), postController.likePost);
router.post('/post/:postId/comment', checkAuthentication(), postController.commentPost);


module.exports = router;