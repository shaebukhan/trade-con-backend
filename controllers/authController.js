const { hashPassword, comparePassword, generateTokenAndSetCookie } = require("../helpers/authHelper");
const UserModel = require("../models/UserModel");
const JWT = require("jsonwebtoken");


//Register 
const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name) {
            return res.send({ message: "Name is Required" });
        }
        if (!email) {
            return res.send({ message: "Email is Required" });
        }
        if (!password) {
            return res.send({ message: "Password is Required" });
        }

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Email Already Registered !! Please Login"
            });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);



        // Create the new user
        const user = await new UserModel({
            name,
            email,
            password: hashedPassword,

        }).save();
        const token = await generateTokenAndSetCookie(res, user._id);
        // console.log(token);
        res.status(201).send({
            success: true,
            message: "Account Created  Successfully.",
            user,
            token,

        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error
        });
    }
};

// LOGIN 
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(200).send({
                success: false,
                message: "Invalid Email!! or Password",
            });
        }
        //check user 
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "Email not Found!"
            });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Credentials",
            });
        }

        const token = await generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();


        res.status(200).send({
            success: true,
            message: "Logged in Successfully !",
            user: {
                ...user._doc,
                password: undefined,
            },
            token

        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Login",
            error
        });
    }
};
//logout 
const logoutController = async (req, res) => {
    res.clearCookie("token");
    res.status(201).send({
        success: true,
        message: "Logged out successfully!",

    });
};


const checkAuth = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};








module.exports = {
    registerController, loginController, logoutController, checkAuth,

};