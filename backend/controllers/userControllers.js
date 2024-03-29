const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = expressAsyncHandler(async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    console.log("Received data in registerUser:", {
      name,
      email,
      password,
      pic,
    });

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill out all fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      pic,
    });

    if (user) {
      console.log("User created successfully:", user);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Failed to create user");
    }
  } catch (error) {
    console.error("Error in registerUser:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const allUsers = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search ? {
    $or: [
      {
        name: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: req.query.search,
          $options: "i",
        },
      },
    ],
  } : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
  console.log("keyword", keyword);
});

module.exports = { registerUser, authUser, allUsers };
