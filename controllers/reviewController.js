const cloudinary = require("../utilis/cloudinaryConfig");
const ReviewModel = require("../models/ReviewModel");

const addReviewController = async (req, res) => {
    try {
        const { name, profession, rating } = req.body;

        // Check if both files (image and video) are uploaded
        if (!req.files || !req.files.image || !req.files.video) {
            return res.status(400).send({
                success: false,
                message: "Image and video are required!",
            });
        }

        // Ensure other required fields are present
        if (!name || !profession || !rating) {
            return res.status(400).send({
                success: false,
                message: "All fields are required!",
            });
        }

        // Upload image to Cloudinary
        const uploadImagePromise = new Promise((resolve, reject) => {
            const imageStream = cloudinary.uploader.upload_stream(
                { resource_type: "image" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result.secure_url); // Cloudinary URL
                }
            );
            imageStream.end(req.files.image[0].buffer);
        });

        // Upload video to Cloudinary
        const uploadVideoPromise = new Promise((resolve, reject) => {
            const videoStream = cloudinary.uploader.upload_stream(
                { resource_type: "video" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result.secure_url); // Cloudinary URL
                }
            );
            videoStream.end(req.files.video[0].buffer);
        });

        // Wait for both uploads to complete
        const [imageUrl, videoUrl] = await Promise.all([uploadImagePromise, uploadVideoPromise]);

        // Create a new review
        const review = await ReviewModel.create({ name, profession, image: imageUrl, video: videoUrl, rating });

        return res.status(201).send({
            success: true,
            message: "Data added successfully.",
            review,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};
const getReviewsController = async (req, res) => {
    try {
        const reviews = await ReviewModel.find({});

        if (!reviews || reviews.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No reviews found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Reviews fetched successfully",
            reviews,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};
const deleteReviewController = async (req, res) => {
    try {
        const { _id } = req.body;

        // Find the review by its ID
        const review = await ReviewModel.findById(_id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        // Extract public_id from the Cloudinary URLs if stored, or modify the URLs to match your structure
        const imagePublicId = review.image.split("/").pop().split(".")[0]; // Extract Cloudinary public_id from image URL
        const videoPublicId = review.video.split("/").pop().split(".")[0]; // Extract Cloudinary public_id from video URL

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(imagePublicId, { resource_type: "image" });

        // Delete video from Cloudinary
        await cloudinary.uploader.destroy(videoPublicId, { resource_type: "video" });

        // Remove the review from the database
        await ReviewModel.findByIdAndDelete(_id);

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


module.exports = { addReviewController, getReviewsController, deleteReviewController };
