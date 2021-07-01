const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    minlength: 2,
    maxlength: 255,
  },
  last_name: {
    type: String,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  age: {
    type: Number,
    min: 6,
    max: 120,
  },
  birth_date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

function UserValidation(user) {
  const schema = Joi.object({
    first_name: Joi.string().min(2).max(255),
    last_name: Joi.string().min(2).max(255),
    email: Joi.string().min(2).max(255),
    password: Joi.string().min(6).max(1024).required(),
    age: Joi.number().min(6).max(120),
    birth_date: Joi.string().regex(
      /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/
    ),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = UserValidation;
