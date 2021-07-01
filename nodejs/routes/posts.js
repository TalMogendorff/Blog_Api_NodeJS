var express = require("express");
const { authorize } = require("../middlewares/auth");
const { Post, postValidation } = require("../models/Posts");
var router = express.Router();

router.get("/specific-post/:id", async (req, res) => {
  let posts = await Post.find({ _id: req.params.id }, null, {
    sort: { _id: -1 },
  }).populate("author_id"); //With password, only for Dev.
  res.send(posts);
});

router.get("/all-posts", async (req, res) => {
  let posts = await Post.find({}, null, {
    sort: { _id: -1 },
  }).populate({ path: "author_id", select: ["first_name", "last_name"] });
  res.send(posts);
});

router.delete("/post/:id", authorize, async (req, res) => {
  let post = await Post.findOneAndRemove({
    _id: req.params.id,
    author_id: req.user._id,
  });
  if (!post) return res.status(404).send("The Post have not found.");
  res.send(`The following post have been deleted ${post}.`);
});

router.put("/post/:id", authorize, async (req, res) => {
  const { error } = postValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let post = await Post.findOne({
    _id: req.params.id,
    author_id: req.user._id,
  });

  if (!post) return res.status(404).send("The Post have not found.");

  post = await Post.findOneAndUpdate(
    { _id: req.params.id, author_id: req.user._id },
    req.body,
    {
      new: true,
    }
  );

  res.send(post);
});

router.post("/post", authorize, async (req, res) => {
  const { error } = postValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let post = new Post({
      title: req.body.title,
      body: req.body.body,
      create_date: req.body.create_date,
      author_id: req.user.id,
    });
    post = await post.save();
    res.send(post);
  } catch (error) {
    if (error) return res.status(400).send("Check the from inputs again");
  }
});

/* GET users listing. */
router.get("/", authorize, function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
