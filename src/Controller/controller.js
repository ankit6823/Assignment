const express = require("express");
const router = express.Router();

const userControllers = require("../Service/UserService")

router.post("/register",userControllers.createUser);
router.get("/getUser", userControllers.getUser);
router.put("/updateUser",userControllers.updateUser);
router.delete("/deleteUser",userControllers.deleteUser);


module.exports = router