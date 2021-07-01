const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  body: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1200,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Post = mongoose.model("Post", postSchema);

function PostValidation(post) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    body: Joi.string().min(2).max(1200).required(),
    create_date: Joi.string().regex(
      /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/
    ),
  });

  return schema.validate(post);
}

exports.Post = Post;
exports.postValidation = PostValidation;
