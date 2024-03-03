const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { accessChat } = require('../controllers/chatControllers'); 
const { fetchChats } = require('../controllers/chatControllers');
const { createGroupChat } = require('../controllers/chatControllers');
const { renameGroup } = require('../controllers/chatControllers');
const { addToGroup } = require('../controllers/chatControllers');
const { removeFromGroup } = require('../controllers/chatControllers');

const router = express.Router();

router.route('/').post(protect,accessChat)
router.route('/').get(protect,fetchChats)
router.route('/group').post(protect,createGroupChat)
router.route('/rename').put(protect,renameGroup)
router.route('/groupeadd').put(protect,addToGroup)
router.route('/grouperemove').put(protect,removeFromGroup)


module.exports = router;
