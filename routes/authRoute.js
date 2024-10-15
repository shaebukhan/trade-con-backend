const express = require("express");
const { registerController, loginController, logoutController, checkAuth } = require("../controllers/authController");
const { requireSignIn } = require("../middlewares/authMiddleware");
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();

//Register Route
router.post("/register", registerController);
// verify 

//login route
router.post("/login", loginController);


//logout
router.post("/logout", logoutController);
//Forgot password 

//check auth 
router.get("/check-auth", verifyToken, checkAuth);
//test route 


module.exports = router;