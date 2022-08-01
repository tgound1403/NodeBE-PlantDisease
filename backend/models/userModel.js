const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //Encrypt password

// Schema
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    followers: {
      type: [String],
      default: []
    },
    following: { type: [String], default: [] },
    // Reset password attr
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    // Verify email attr
    verifyEmailToken: String,
    linkExpires: Date,
    // Edit profile attr
    firstName: {
      type: String,
      required: true,
      default: ""
    },
    lastName: {
      type: String,
      required: true,
      default: ""
    },
    birthday: {
      type: Date,
      required: true,
      default: ""
    },
    phoneNumber: {
      type: String,
      required: true,
      default: ""
    },
    gender: {
      type: String,
      required: true,
      default: ""
    },
  },
  {
    timestamps: true,
  }
);

// Use for Login ( compare encrypted password )
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// will encrypt password when Register
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
