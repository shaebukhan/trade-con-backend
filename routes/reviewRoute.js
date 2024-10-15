const express = require("express");
const { addReviewController, getReviewsController, deleteReviewController } = require("../controllers/reviewController");
const router = express.Router();

const upload = require("../utilis/upload");

// Use `upload.fields()` to handle both image and video uploads
router.post("/add", upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]), addReviewController);
router.get("/reviews", getReviewsController);
router.post("/delete-review", deleteReviewController);
module.exports = router;
