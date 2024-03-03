const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userControllers");
const { authUser } = require("../controllers/userControllers");
const { allUsers } = require("../controllers/userControllers");
const {protect} = require("../middleware/authMiddleware");

router.route("/").post(registerUser).get(protect,allUsers);
router.post('/login',authUser)



module.exports = router;