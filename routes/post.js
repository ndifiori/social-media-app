const router = require('express').Router();
const Post = require("../models/Post");
const User = require('../models/User');

// create a post
router.post('/', async (req, res) => {
  const newPost = new Post(req.body)

  try {
    const savePost = await newPost.save();
    res.status(200).json(savePost);
  } catch (err) {
    res.status(500).json(err);
  }
});


// update a post
router.put('/:id', async (req, res) => {
  try {
    const updatePost = await Post.findById(req.params.id);
    if(Post.userId === req.body.userId) {
      await Post.updateOne({$set: req.body})
      res.status(200).json("this post has been updated")
    } else {
      res.status(403).json("you can only update your post")
    }
  } catch (err) {
    return res.status(500).json(err)
  }
})


// delete a post
router.delete('/:id', async (req, res) => {
  try {
    if(Post.userId === req.body.userId) {
      const deletePost = await Post.findByIdAndRemove(req.params.id);
      res.status(200).json("this post has been deleted");
    } else {
      res.status(403).json("you can only delete your post")
    }
  } catch (err) {
    return res.status(500).json(err);
  }
})


// like a post
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({$push: {likes: req.body.userId}});
      res.status(200).json("you have liked this post");
    } else {
      await post.updateOne({$pull: {likes: req.body.userId}});
      res.status(200).json("you have unliked this post")
    }
  } catch (err) {
    return res.status(500).json(err);
  }
})


// get a post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
})


// get all posts
router.get('/timeline/all',  async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({userId: currentUser._id});
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) =>{
        return Post.find({userId : friendId})
      })
    );
    res.json(userPosts.concat(...friendPosts))

  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});


module.exports = router;
