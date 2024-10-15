const subTradeModal = require("../models/SubTradeModel");
const workersModel = require("../models/workersModel");
const cloudinary = require("../utilis/cloudinaryConfig");

//add sub trade 

const addSubTradeController = async (req, res) => {
    try {
        const { profession, tradeId } = req.body;

        // Check if both files (image and video) are uploaded
        if (!req.files || !req.files.image) {
            return res.status(400).send({
                success: false,
                message: "Image is required!",
            });
        }

        // Ensure other required fields are present
        if (!profession) {
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
                    if (error) {
                        reject({
                            message: "Failed to upload image to Cloudinary",
                            error,
                        });
                    } else {
                        resolve(result.secure_url); // Cloudinary URL
                    }
                }
            );
            imageStream.end(req.files.image[0].buffer); // Access the image buffer
        });

        // Wait for image upload to complete
        const imageUrl = await uploadImagePromise;

        // Create a new review
        const subTrade = await subTradeModal.create({ profession, image: imageUrl, tradeID: tradeId });

        return res.status(201).send({
            success: true,
            message: "Data added successfully.",
            subTrade
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};
//get single 

const getSingleSubTradeController = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the trade by ID
        const subTrade = await subTradeModal.findById(id);

        if (!subTrade) {
            return res.status(204).send({
                success: false,
                message: "Profession Not Found !!",
            });
        }

        res.status(200).send({
            success: true,
            subTrade
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Fetching Profession",
            error,
        });
    }
};

//get sub trades

const getAllSubTradesController = async (req, res) => {
    try {
        const { id } = req.params;
        const subTrades = await subTradeModal.find({
            tradeID: id
        });

        if (!subTrades || subTrades.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No professions found",
            });
        }

        res.status(200).send({
            success: true,
            subTrades,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

//update 
const updateSubTradeController = async (req, res) => {
    try {
        const { profession } = req.body;
        const { id } = req.params;

        // Check if profession is provided
        if (!profession) {
            return res.status(400).send({
                success: false,
                message: "Profession is required",
            });
        }

        // Find the existing subTrade by ID
        const subTrade = await subTradeModal.findById(id);
        if (!subTrade) {
            return res.status(404).send({
                success: false,
                message: "Sub trade not found",
            });
        }

        // Variable to store the new image URL
        let imageUrl = subTrade.image;  // Keep the existing image URL

        // Check if a new image was uploaded
        if (req.files && req.files.image && req.files.image[0]) {
            // If an existing image is present, delete it from Cloudinary
            if (subTrade.image) {
                // Extract the public ID from the existing image URL
                const publicId = subTrade.image.split('/').pop().split('.')[0];

                // Delete the existing image from Cloudinary
                await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
            }

            // Upload the new image to Cloudinary using a stream for buffer upload
            const uploadImagePromise = new Promise((resolve, reject) => {
                const imageStream = cloudinary.uploader.upload_stream(
                    { resource_type: "image" },
                    (error, result) => {
                        if (error) {
                            reject({
                                message: "Failed to upload image to Cloudinary",
                                error,
                            });
                        } else {
                            resolve(result.secure_url);  // Get the new Cloudinary URL
                        }
                    }
                );
                imageStream.end(req.files.image[0].buffer);  // Access the image buffer
            });

            // Await the uploaded image URL
            imageUrl = await uploadImagePromise;
        }

        // Update the subTrade data
        subTrade.profession = profession;
        subTrade.image = imageUrl;

        // Save the updated subTrade
        await subTrade.save();

        return res.status(200).send({
            success: true,
            message: "Sub trade updated successfully",
            subTrade,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};


//delete 
const deleteSubTradeController = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the subTrade by ID
        const subTrade = await subTradeModal.findByIdAndDelete(id);

        if (!subTrade) {
            return res.status(404).send({
                success: false,
                message: "Sub trade not found",
            });
        }
        const imagePublicId = subTrade.image.split("/").pop().split(".")[0];
        // Optionally, you can delete the image from Cloudinary here if needed
        // For example:
        await cloudinary.uploader.destroy(imagePublicId, { resource_type: "image" });

        return res.status(200).send({
            success: true,
            message: "Sub trade deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};



const workersAddController = async (req, res) => {
    try {
        const { id, companyName, location, experience, email, phone, services, reviews, terms, notifications } = req.body;

        // Check if the email is already registered
        const existingEmail = await workersModel.findOne({ email });
        if (existingEmail) {
            return res.status(200).send({
                success: false,
                message: "This email is already registered.",
            });
        }

        // Check if the phone is already registered
        const existingPhone = await workersModel.findOne({ phone });
        if (existingPhone) {
            return res.status(200).send({
                success: false,
                message: "This phone number is already registered.",
            });
        }

        // If both email and phone are not registered, create a new worker
        const workerDetail = await workersModel.create({
            profession: id,
            companyName,
            location,
            experience,
            email,
            phone,
            services,
            reviews,
            terms,
            notifications
        });

        return res.status(201).send({
            success: true,
            message: "Data added successfully.",
            workerDetail
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};


const getAllworkersDetailsController = async (req, res) => {
    const { id } = req.params;
    const workerSpecial = await workersModel.find({
        profession: id, status: 1
    });

    if (!workerSpecial || workerSpecial.length === 0) {
        return res.status(204).send({
            success: false,
            message: "No Workers found",
        });
    }

    res.status(200).send({
        success: true,
        workerSpecial,
    });


};



module.exports = {
    addSubTradeController,
    getAllSubTradesController, updateSubTradeController, deleteSubTradeController, getSingleSubTradeController, workersAddController, getAllworkersDetailsController
};