const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
  }),
});

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message);
      return res.status(400).json({ error: errorMessage });
    }
    next();
  };
};

const roleChangeSchema = Joi.object({
  role: Joi.string().valid("user", "admin").required().messages({
    "any.only": "Role must be either 'user' or 'admin'",
  }),
});

const validateRoleChange = validateBody(roleChangeSchema);

module.exports = {
  validateRegister: validateBody(registerSchema),
  validateLogin: validateBody(loginSchema),
  validateRoleChange,
};
