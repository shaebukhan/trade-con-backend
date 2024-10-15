const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }
};

const comparePassword = async (password, hash) => {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
};


const generateTokenAndSetCookie = async (res, userId) => {
    const isProduction = process.env.NODE_ENV === "production";

    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d", // Token expiration set to 10 minutes
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction, // Secure only in production
        sameSite: isProduction ? "strict" : "lax", // Strict in production, lax in development
        maxAge: 12 * 10 * 60 * 1000, // Cookie expiration set to 10 minutes
    });

    return token;
};

function getFormattedDateTime() {
    const now = new Date();

    // Options for formatting date and time
    const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

    // Format date and time
    const date = now.toLocaleDateString('en-US', optionsDate);
    const time = now.toLocaleTimeString('en-US', optionsTime);

    return { date, time };
}

const { date, time } = getFormattedDateTime();

const crypto = require('crypto');

function generateRandomString(length) {
    return crypto.randomBytes(length)
        .toString('base64') // You can use 'hex', 'base64', etc.
        .slice(0, length);  // Trim to the desired length
}




module.exports = {
    hashPassword,
    comparePassword,
    generateTokenAndSetCookie,
    getFormattedDateTime,
    generateRandomString
};

