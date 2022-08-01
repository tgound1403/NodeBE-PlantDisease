const express = require("express");
const {
  registerUser,
  loginUser,
  verifyEmail,
  getVerifyRequest,
  getUserInfo,
  editUserInfo,
  forgotPassword,
  postResetRequest,
  getResetRequest,
} = require("../controllers/userControllers");
const router = express.Router();

router.route("/").post(registerUser);
router.route("/info/:id").get(getUserInfo);
router.route("/login").post(loginUser);
router.route("/verify").post(verifyEmail);
router.route("/verify/:token").get(getVerifyRequest);
router.route("/edit-profile/:id").post(editUserInfo);
router.route("/forgot-password").post(forgotPassword);
// router.route('/forgot-password').get(passwordReset);
router.route("/reset/:token").post(postResetRequest);
router.route("/reset/:token").get(getResetRequest);

module.exports = router;
