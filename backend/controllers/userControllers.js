const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

// email handler
// unique string
const { v4: uuidv4 } = require("uuid");
// env variables
require("dotenv").config();
// path for verify page

var async = require("async");
var crypto = require("crypto");
var session = require("express-session");
var bcrypt = require("bcryptjs");
var express = require("express");
var path = require("path");
var session = require("cookie-session");
var passport = require("passport");
var flash = require("express-flash");
// var logger = require('logger')
var nodemailer = require("nodemailer");
var axios = require("axios");

const router = express.Router();

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.use(passport.initialize());
router.use(passport.session());
router.use(express());
router.use(flash());
// router.use(logger('dev'));
router.use(
  session({
    secret: "secret option",
    resave: true,
    saveUninitialized: true,
  })
);

// Verify page route
router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "./verified.html"));
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email, name });

  if (userExist) {
    res.status(400);
    console.log("User already exist");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin,
      verified: user.verified,
    });
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${"https://desolate-everglades-44147.herokuapp.com"}/api/users/verify`,
        {
          email: user.email,
        },
        config
      );
      console.log(data);
      console.log("Calling send verify");
    } catch (error) {
      console.log(error.message);
      console.log("Error call send verify");
    }
  } else {
    res.status(400);
    console.log("Error occurred! ");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user.verified === false) {
    res.status(400);
    console.log("User not verified, please check your mail for verifying");
  } else {
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      console.log("Invalid email or password");
      console.log(req.body.email);
    }
  }
});
const verifyEmail = (req, res) => {
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
          console.log("create token: " + token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, function (err, user) {
          user.verifyEmailToken = token;
          user.linkExpires = Date.now() + 3600000;

          user.save(function (err) {
            done(err, token, user);
          });
          console.log("user updated: ");
        });
      },
      function (token, user, done) {
        console.log(user);
        console.log(process.env.AUTH_MAIL);
        verifyEmailToken = token;
        linkExpires = Date.now() + 3600000;
        var smtpTransport = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            type: "login",
            user: process.env.AUTH_MAIL || "trieuduong140302@gmail.com",
            pass: process.env.MY_AUTH_PASS || "axlnblgimeewlzjl",
          },
        });
        var mailOptions = {
          to: req.body.email,
          from: "PLANT DISEASE TEAM",
          subject: "Verify Email",
          text:
            "Bạn nhận được mail này vì bạn cần xác minh tài khoản để sử dụng ứng dụng Plant Disease của chúng tôi.\n\n" +
            "Vui lòng nhấn link sau đây để xác nhận: " +
            "http://" +
            req.headers.host +
            "/api/users/verify/" +
            token,
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          // req.flash('info', 'An email has been send to ' + user.email + ' with further instructions.');
          console.log("mail sent");
          console.log(err.message);
        });
      },
    ],
    function (err) {
      if (err) return err;
      res.redirect("/");
    }
  );
};

const getVerifyRequest = (req, res) => {
  User.findOne(
    { verifyEmailToken: req.params.token, linkExpires: { $gt: Date.now() } },
    function (err, user) {
      if (!user) {
        console.log(req.params.token);
        console.log("Verify token is invalid or has expired.");
        return res.redirect("/");
      }
      console.log(req.params.token, user);
      user.verified = true;
      user.verifyEmailToken = undefined;
      user.linkExpires = undefined;
      console.log(user);
      user.save(function (err) {
        req.logIn(user, function (err) {
          // done(err, user);
        });
      });
      res.redirect(req.headers.host + "/verify");
    }
  );
};

// const passwordReset = (req, res) => {
//   // res.render("/Web1/frontend/src/pages/ForgotPassword/index.js", {
//   //     user: req.user
//   // });
// };

const forgotPassword = (req, res) => {
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        console.log(req.body.email);
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            console.log("no account with that email");
            return res.redirect(
              req.headers.host + "/api/users/forgot-password"
            );
            // throw new Error("user already existed");
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000;

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.AUTH_MAIL,
            pass: process.env.AUTH_PASS,
          },
        });
        var mailOptions = {
          to: user.email,
          from: process.env.AUTH_MAIL,
          subject: "Password Reset",
          text:
            "Bạn nhận được mail này vì bạn đã yêu cầu đặt lại mật khẩu cho tài khoản Plant Disease.\n\n" +
            "Vui lòng truy cập link sau đây để tiến hành đặt lại mật khẩu: " +
            "http://" +
            req.headers.host +
            "/api/users/reset/" +
            token +
            "\n\n" +
            "Nếu bạn không yêu cầu điều này vui lòng bỏ qua email và mật khẩu của bạn sẽ giữ nguyên không thay đổi.",
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          // req.flash('info', 'An email has been send to ' + user.email + ' with further instructions.');
          console.log("mail sent");
          done(err, "done");
        });
      },
    ],
    function (err) {
      if (err) return err;
      res.redirect("/");
    }
  );
};

const postResetRequest = (req, res) => {
  console.log("Post reset request is running");
  async.waterfall(
    [
      function (done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
          },
          function (err, user) {
            if (!user) {
              console.log(req.params.token);
              req.flash(
                "error",
                "Password reset token is invalid or has expired."
              );
              console.log("Stop here");
              return res.redirect(
                req.headers.host + "/api/users/forgot-password"
              );
            }

            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            console.log(user);

            user.save(function (err) {
              req.logIn(user, function (err) {
                // done(err, user);
              });
            });
          }
        );
      },
      function (user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          auth: {
            user: process.env.AUTH_MAIL,
            pass: process.env.AUTH_PASS,
          },
        });
        var mailOptions = {
          to: user.email,
          from: process.env.AUTH_MAIL,
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            user.email +
            " has just been changed.\n",
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          req.flash("success", "Success! Your password has been changed.");
          console.log("Success! Your password has been changed.");
          done(err);
        });
      },
    ],
    function (err) {
      // res.redirect('/');
    }
  );
};

const getResetRequest = (req, res) => {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    function (err, user) {
      if (!user) {
        console.log(req.params.token);
        // req.flash('error', 'Password reset token is invalid or has expired.');
        console.log("Password reset token is invalid or has expired.");
        return res.redirect(req.headers.host + "/api/users/forgot-password");
      }
      console.log(req.params.token, user);
      // res.redirect('http://localhost:8080/reset/' + req.params.token);
      res.render("send-reset.jade", {
        user: req.user,
      });
    }
  );
};

const editUserInfo = (req, res) => {
  console.log("Edit user info is running");
  console.log(req.body);
  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.birthday = req.body.birthday;
      user.phoneNumber = req.body.phoneNumber;
      user.gender = req.body.gender;
      user.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("User info updated");
          res.redirect(req.headers.host + "/profile");
        }
      });
    }
  });
};

const getUserInfo = (req, res) => {
  console.log("get user info is running");
  console.log(req.params.id);
  User.findOne({ _id: req.params.id })
    .then((data) => {
      console.log("Users: ", data);
      res.json(data);
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  getVerifyRequest,
  getUserInfo,
  editUserInfo,
  forgotPassword,
  postResetRequest,
  getResetRequest,
};
