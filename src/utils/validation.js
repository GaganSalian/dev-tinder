const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};


// const Joi = require("joi");

// // Signup Schema using Joi
// const signUpSchema = Joi.object({
//   firstName: Joi.string().min(2).max(50).required(),
//   lastName: Joi.string().min(2).max(50).required(),
//   emailId: Joi.string().email().required(),
//   password: Joi.string().min(8).required().messages({
//     "string.min": "Password should be at least 8 characters",
//     "any.required": "Password is required",
//   }),
// });

// // Edit Profile allowed fields schema (optional fields)
// const editProfileSchema = Joi.object({
//   firstName: Joi.string().min(2).max(50),
//   lastName: Joi.string().min(2).max(50),
//   emailId: Joi.string().email(),
//   photoUrl: Joi.string().uri(),
//   gender: Joi.string().valid("male", "female", "other"),
//   age: Joi.number().min(18),
//   about: Joi.string().max(300),
//   skills: Joi.array().items(Joi.string()),
// }).unknown(false); // restrict to only these fields

// // Function to validate signup
// const validateSignUpData = (req) => {
//   const { error } = signUpSchema.validate(req.body);
//   if (error) throw new Error(error.details[0].message);
// };

// // Function to validate edit profile
// const validateEditProfileData = (req) => {
//   const { error } = editProfileSchema.validate(req.body);
//   if (error) throw new Error(error.details[0].message);
// };

// module.exports = {
//   validateSignUpData,
//   validateEditProfileData,
// };
