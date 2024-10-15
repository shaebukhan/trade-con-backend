const workersModel = require("../models/workersModel");


const getAllListingsController = async (req, res) => {

    const Listings = await workersModel.find({
    });

    if (!Listings || Listings.length === 0) {
        return res.status(204).send({
            success: false,
            message: "No Workers found",
        });
    }

    res.status(200).send({
        success: true,
        Listings,
    });

};

// Update listing status
const updateListingController = async (req, res) => {
    try {
        const { id } = req.params; // Listing ID from URL
        const { status } = req.body; // New status from request body

        // Find the listing by ID and update the status
        const updatedListing = await workersModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedListing) {
            return res.status(204).json({
                success: false,
                message: 'Listing not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Listing status updated successfully',
            listing: updatedListing
        });
    } catch (error) {
        console.error('Error updating listing:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error, could not update listing'
        });
    }
};

//delete 

// Delete listing
const deleteListingController = async (req, res) => {
    try {
        const { id } = req.params; // Listing ID from URL

        // Find the listing by ID and delete it
        const deletedListing = await workersModel.findByIdAndDelete(id);

        if (!deletedListing) {
            return res.status(204).json({
                success: false,
                message: 'Listing not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Listing deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting listing:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error, could not delete listing'
        });
    }
};




module.exports = {
    getAllListingsController, updateListingController, deleteListingController
};
