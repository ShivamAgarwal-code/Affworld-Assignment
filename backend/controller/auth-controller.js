const jwt = require("jsonwebtoken");
const User = require("../model/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

// Registration Logic
const register = async (req, res, next) => {
  const { username, email, password, createdDate } = req.body;
  const currentDate = new Date();

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ msg: "User already exists" });
  }

  // //hashing password using bcrypt
  // const saltRound = 10; or const saltRound = await bcrypt.genSalt(10);
  // const hash_password = await bcrypt.hash(password, saltRound);

  const newUser = await User.create({
    username,
    email,
    password,
    createdDate: currentDate,
  });

  const token = await newUser.generateToken();

  try {
    console.log(newUser);
    res.status(201).json({
      msg: "Registration successful",
      token,
      userId: newUser._id.toString(),
    });
  } catch (error) {
    // res.status(500).json({ msg: "Internal server error" });
    next(error);
  }
};

// Login Logic
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // const isUserValid = await bcrypt.compare(password, userExists.password);

    const isUserValid = await userExists.comparePassword(password);

    const token = await userExists.generateToken();

    if (isUserValid) {
      res.status(200).json({
        msg: "Login successful",
        token,
        userId: userExists._id.toString(),
      });
    } else {
      res.status(400).json({ msg: "Invalid email or password" });
    }
  } catch (error) {
    // res.status(500).json({ msg: "Internal server error" });'
    next(error);
  }
};

// Send User Login
const user = async (req, res) => {
  try {
    const userData = req.user;
    res.status(200).json({ userData });
  } catch (error) {
    console.log(`User Error: ${error}`);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "Email not found" });
  }

  const token = await user.generateToken();

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "webstar600@gmail.com",
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const resetPageLink =
    "http://localhost:5000/resetPassword?token=" + token + "&email=" + email;

  var mailOptions = {
    from: "Affworld Assignment 1",
    to: email,
    subject: "Reset your Password",
    html: `<p>
    Click <a href="${resetPageLink}">here</a> to Reset Password
  </p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      return res.json({ message: "Email Sent" });
    }
  });
};

const resetPassword = async (req, res) => {
  const { email, token } = req.params;
  const { newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(newPassword, saltRound);
    const user = await User.findByIdAndUpdate(
      { _id: decoded.userId },
      { newPassword: hash_password }
    );
    console.log(user);
    if (user) {
      res.status(200).json({ msg: "Password reset successful" });
    } else {
      res.status(400).json({ msg: "User Not Found" });
    }
  } catch (error) {
    return res.status(401).json({ msg: "Unauthorized, Invalid Token." });
  }
};

module.exports = { register, login, user, forgotPassword, resetPassword };
