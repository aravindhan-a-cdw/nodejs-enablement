// tests/userService.test.js
const mockingoose = require("mockingoose");
const { PostModel: Post, CommentModel } = require("../../models/post");
const User = require("../../models/user");
const postService = require("../../services/post.service");

describe("Post Service", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it("Should return all posts", async () => {
    const samples = [{ title: "Post 1" }, { title: "Post 2" }];

    mockingoose(Post).toReturn(samples, "find");

    const posts = await postService.getPosts();

    expect(posts.length).toBe(samples.length);
  });

  it("Should return a post", async () => {
    const samplePost = { title: "Post 1" };

    mockingoose(Post).toReturn(samplePost, "findOne"); // findById internally uses findOne and hence mocking findById didn't work

    const post = await postService.getPost("60d5f60a18d3d80014bf0a2b");

    expect(post.title).toBe(samplePost.title);
  });

  //   it("should create a post and populate the createdBy field", async () => {
  //     const postData = { title: "Test Post", caption: "This is a test post", link: "http://link.link/link", location: "Chennai" };
  //     const user = {
  //       id: "60d5f60a18d3d80014bf0a2c",
  //       name: "John Doe",
  //       employeeId: "E12345",
  //     };

  //     const createdPost = {
  //       _id: "60d5f60a18d3d80014bf0a2b",
  //       title: postData.title,
  //       content: postData.content,
  //       createdBy: user.id,
  //       populate: jest.fn().mockResolvedValue({
  //         _id: '60d5f60a18d3d80014bf0a2b',
  //         title: postData.title,
  //         content: postData.content,
  //         createdBy: {
  //           _id: user.id,
  //           name: user.name,
  //           employeeId: user.employeeId
  //         }
  //       })
  //     };

  //     const populatedPost = {
  //       ...createdPost,
  //       createdBy: {
  //         _id: user.id,
  //         name: user.name,
  //         employeeId: user.employeeId,
  //       },
  //     };

  //     // Mock the save method
  //     mockingoose(Post).toReturn(createdPost, "save");
  //     // Mock the populate method
  //     mockingoose(Post).toReturn(populatedPost, "findOne");
  //     mockingoose(User).toReturn(user, "findOne");

  //     const result = await postService.createPost(postData, user);

  //     expect(result._id.toString()).toBe("60d5f60a18d3d80014bf0a2b");
  //     expect(result.title).toBe("Test Post");
  //     expect(result.content).toBe("This is a test post");
  //     expect(result.createdBy._id.toString()).toBe("60d5f60a18d3d80014bf0a2c");
  //     expect(result.createdBy.name).toBe("John Doe");
  //     expect(result.createdBy.employeeId).toBe("E12345");
  //   });

  it("should throw an error if save fails", async () => {
    const postData = {
      title: "Test Post",
      caption: "This is a test post",
      link: "http://link.link/link",
      location: "Chennai",
    };
    const user = {
      id: "60d5f60a18d3d80014bf0a2c",
      name: "John Doe",
      employeeId: "E12345",
    };

    // Mock the save method to throw an error
    mockingoose(Post).toReturn(new Error("Save failed"), "save");

    await expect(postService.createPost(postData, user)).rejects.toThrow(
      "Save failed"
    );
  });

  it("should delete a post", async () => {
    const postData = {
      _id: "60d5f60a18d3d80014bf0a2b",
      title: "Test Post",
      content: "This is a test post",
      createdBy: "60d5f60a18d3d80014bf0a2c",
    };

    // Mock the findByIdAndDelete method
    mockingoose(Post).toReturn(postData, "findOneAndDelete");

    const post = await postService.deletePost(postData._id);
    expect(postData._id).toBe(post.id);
  });

  it("Add like to post", async () => {
    const postData = new Post({
        title: "Test Post",
        caption: "This is a test post",
        link: "http://link.link",
        location: "Chennai",
        createdBy: "60d5f60a18d3d80014bf0a2c",
        likes: [],
        comments: []
      });
      const user = {
        _id: "60d5f60a18d3d80014bf0b3d",
        name: "John Doe",
        employeeId: "E12345",
      };

      const likedPostData = {
        ...postData,
        likes: [user._id]
      }

      const post = await postService.likePost(postData, user);
      mockingoose(Post).toReturn(likedPostData, "save");

      expect(post.likes.length).toBe(1);
  });

  it('should edit a post and return the updated post', async () => {
    const postId = '60d5f60a18d3d80014bf0a2b';
    const existingPostData = {
      _id: postId,
      title: 'Old Title',
      content: 'Old content',
      location: 'Old location',
      link: 'Old link',
      caption: 'Old caption',
      createdBy: '60d5f60a18d3d80014bf0a2c'
    };

    const updatedPostData = {
      title: 'New Title',
      content: 'Old content',
      location: 'New location',
      link: 'New link',
      caption: 'New caption'
    };

    // Mock the findById method
    mockingoose(Post).toReturn(existingPostData, 'findOne');

    // Mock the save method
    mockingoose(Post).toReturn(updatedPostData, 'save');

    const existingPost = await Post.findById(postId);
    const result = await postService.editPost(existingPost, updatedPostData);

    expect(result.title).toBe('New Title');
    expect(result.location).toBe('New location');
    expect(result.link).toBe('New link');
    expect(result.caption).toBe('New caption');
  });

  it('should not update fields that are not provided', async () => {
    const postId = '60d5f60a18d3d80014bf0a2b';
    const existingPostData = {
      _id: postId,
      title: 'Old Title',
      content: 'Old content',
      location: 'Old location',
      link: 'Old link',
      caption: 'Old caption',
      createdBy: '60d5f60a18d3d80014bf0a2c'
    };

    const partialUpdateData = {
      title: 'New Title'
    };

    // Mock the findById method
    mockingoose(Post).toReturn(existingPostData, 'findOne');

    // Mock the save method
    mockingoose(Post).toReturn({
      ...existingPostData,
      ...partialUpdateData
    }, 'save');

    const existingPost = await Post.findById(postId);
    const result = await postService.editPost(existingPost, partialUpdateData);

    expect(result.title).toBe('New Title');
    expect(result.location).toBe('Old location');
    expect(result.link).toBe('Old link');
    expect(result.caption).toBe('Old caption');
  });

  it('should add a comment to the post and return the updated post', async () => {
    const postId = '60d5f60a18d3d80014bf0a2b';
    const userId = '60d5f60a18d3d80014bf0a2c';
    const commentId = '60d5f60a18d3d80014bf0a2d';
    
    const post = {
      _id: postId,
      title: 'Test Post',
      caption: 'This is a test post',
      createdBy: userId,
      comments: [],
      save: jest.fn().mockResolvedValue(this)
    };

    const commentData = { text: 'This is a test comment' };
    const user = { _id: userId, name: 'John Doe' };

    const savedComment = {
      _id: commentId,
      text: 'This is a test comment',
      user: userId,
      save: jest.fn().mockResolvedValue(this)
    };

    // Mock the CommentModel save method
    mockingoose(CommentModel).toReturn(savedComment, 'save');

    // Mock the PostModel save method
    mockingoose(Post).toReturn(post, 'save');

    // Mock the findById method for Post
    mockingoose(Post).toReturn(post, 'findOne');

    const result = await postService.addCommentToPost(commentData, post, user);

    expect(result.comments.length).toBe(1);
    expect(result.title).toBe('Test Post');
  });

  it('should throw an error if saving the comment fails', async () => {
    const postId = '60d5f60a18d3d80014bf0a2b';
    const userId = '60d5f60a18d3d80014bf0a2c';
    
    const post = {
      _id: postId,
      title: 'Test Post',
      content: 'This is a test post',
      createdBy: userId,
      comments: [],
      save: jest.fn().mockResolvedValue(this)
    };

    const commentData = { text: 'This is a test comment' };
    const user = { _id: userId, name: 'John Doe' };

    // Mock the CommentModel save method to throw an error
    mockingoose(CommentModel).toReturn(new Error('Save failed'), 'save');

    await expect(postService.addCommentToPost(commentData, post, user)).rejects.toThrow('Save failed');
  });

});
