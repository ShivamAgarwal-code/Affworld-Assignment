const express = require("express");
const authRouter = express();

const {
  register,
  login,
  user,
  forgotPassword,
  resetPassword,
} = require("../controller/auth-controller");
const { signupSchema, loginSchema } = require("../validator/auth-validator");
const validate = require("../middleware/validate-middleware");
const authMiddleware = require("../middleware/auth-middleware");

authRouter.post("/register", validate(signupSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.get("/user", authMiddleware, user);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.post("/resetPassword/:email/:token", resetPassword);

module.exports = authRouter;
