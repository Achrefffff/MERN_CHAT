const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");

const accessChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("user id parameter is missing");
    return res.status(400).send({ message: "user id parameter is missing" });
  }
  let isChat = await Chat.find({
    isGroupchat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate;
  isChat,
    {
      path: "latestMessage.sender",
      select: "name pic email",
    };
  if (isChat.length > 0) {
    return send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupchat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error("Chat could not be created", error.message);
    }
  }
});

const fetchChats = expressAsyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error("Chats could not be fetched", error.message);
  }
});

const createGroupChat = expressAsyncHandler(async (req, res) => {
  if (!req.body.user || req.body.name) {
    return res
      .status(400)
      .send({ message: "user or name parameter is missing" });
  }
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(400).send({
      message: "il faut au moins 2 utilisateurs pour créer un groupe",
    });
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupchat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error("Group chat could not be created", error.message);
  }
});

const renameGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { 
            chatName
        },
        { new: true }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    if(!updatedChat){
        res.status(400);
        throw new Error("Group chat  not found")
    } else {
        res.json(updatedChat);
    }
})
const addToGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const added= await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId }
        },
        { new: true }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    if(!added){
        res.status(404);
        throw new Error("Group chat  not found")
    } else {
        res.json(added);
    }
})

const removeFromGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!removed) {
      res.status(404);
      throw new Error("Group chat  not found");
    } else {
      res.json(removed);
    }
})
module.exports = { accessChat, fetchChats, createGroupChat ,renameGroup,addToGroup,removeFromGroup};
