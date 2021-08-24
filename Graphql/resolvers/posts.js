const Post = require('../../models/Post.js');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const allPosts = await Post.find();
        return allPosts;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);

        // If post exists...
        if (post) {
          // return it
          return post;
        } else {
          // else if post doesn't exist throw error
          throw new Error('Post not found!');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
