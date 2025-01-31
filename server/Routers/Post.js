const router = require("express").Router();
const Post = require("../Models/Post");
const User = require("../Models/User");
const authentication = require("../Middlewares/Authenticaiton");
const strToTagsArr = require("../functions/strToTagsArr");
const upload = require("../Middlewares/multer");
const fs = require("fs");
router.post("/", authentication, upload.single("file"), async (req, res) => {
  try {
    const { title, body, readtime, tags } = req.body;
    const user = req.user;
    if (!user) return res.status(409).json("Bad request");
    const tagsArr = strToTagsArr(tags + " ");
    const post = await Post.create({
      title,
      body,
      imgUrl: req.file && req.file.path,
      readtime,
      tags: tagsArr,
      author_id: user.id,
    });
    res.json("Successfully created!");
  } catch (err) {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(409).send(err.message);
  }
});

router.put("/:id", authentication, upload.single("file"), async (req, res) => {
  try {
    const id = req.params.id;
    const tags = strToTagsArr(req.body.tags + " ");
    const { title, readtime, body, file } = req.body;
    const post = await Post.findByIdAndUpdate(
      id,
      {
        title,
        readtime,
        body,
        tags: tags,
        imgUrl: req.file ? req.file.path : file,
      },
      { new: true }
    );
    post && res.json("updated");
  } catch (err) {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(409).send(err.message);
  }
});

router.get("/relatedposts", async (req, res) => {
  try {
    const limit = req.query.limit ? req.query.limit : 0;
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Something went wrong!");
  }
});
router.post("/like", authentication, async (req, res) => {
  try {
    const postId = req.body.id;
    const _id = req.user.id;
    const post = await Post.findById(postId);
    const liked = post.likes.includes(_id);
    if (liked) {
      post.likes = post.likes.filter(
        (like) => JSON.stringify(like) !== JSON.stringify(_id)
      );
    } else {
      post.likes.push(_id);
    }
    await Post.findByIdAndUpdate(postId, post, {
      new: true,
    });
    res.status(200).send("reacted");
  } catch (err) {
    res.status(409).send(err.message);
  }
});

router.get("/", async (req, res) => {
  const offset = req.query.offset ? req.query.offset : 0;
  const limit = req.query.limit ? req.query.limit : 10;
  const category = req.query.category;
  let posts;
  if (category === "top") {
    const result = await Post.find({})
      .sort({ likes: -1 })
      .skip(parseInt(offset))
      .limit(limit);
    console.log(offset);
    posts = result;
  } else {
    posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(limit);
  }

  const newposts = await Promise.all(
    posts.map(async (post) => {
      if (post.author_id) {
        try {
          const user = await User.findById(post.author_id);
          const userInfo = {
            author_id: user._id,
            author: user.username,
            authorProfile: user.profileImg,
          };
          const userLiked = post.likes.includes(user._id);
          if (user)
            return {
              id: post._id,
              title: post.title,
              tags: post.tags,
              imgUrl: post.imgUrl,
              createdAt: post.createdAt,
              readtime: post.readtime,
              likes: post.likes.length,
              userLiked: userLiked,
              ...userInfo,
            };
        } catch (err) {
          return post;
        }
      }
    })
  );
  res.json(newposts);
});

router.get("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    let post = await Post.findById(postId);
    if (!post) res.status(404).json("Bad request");
    const user = await User.findById(post.author_id);
    const userLiked = post.likes.includes(user._id);
    post = {
      id: post._id,
      title: post.title,
      tags: post.tags,
      createdAt: post.createdAt,
      likes: post.likes.length,
      userLiked: userLiked,
      author_id: user._id,
      readtime: post.readtime,
      author: user.username,
      imgUrl: post.imgUrl,
      body: post.body,
    };
    res.json(post);
  } catch (err) {
    res.status(500).json("Something went wrong!");
  }
});

router.delete("/:id", authentication, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Post.findByIdAndDelete(id);
    result && res.json("Deleted");
  } catch (err) {
    res.status(409).send(err.message);
  }
});
module.exports = router;
