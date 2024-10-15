const TradeModel = require("../models/TradeModel");

//add trade 
const addTradeController = async (req, res) => {
    try {
        const { trade } = req.body;

        // Validation
        if (!trade) {
            return res.send({ message: "Trade is Required" });
        }

        // Check if the  trade  already exists
        const existingTrade = await TradeModel.findOne({ trade });
        if (existingTrade) {
            return res.status(200).send({
                success: false,
                message: "Trade Already Exists !! "
            });
        }

        // Create the new  trades
        const newTrade = new TradeModel({ trade });
        await newTrade.save();

        res.status(201).send({
            success: true,
            message: "Trade Added Successfully.",
            newTrade

        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Adding trade",
            error
        });
    }
};


const getAllTradesController = async (req, res) => {
    try {

        const trades = await TradeModel.find({});


        if (!trades || trades.length === 0) {
            return res.status(204).json({ success: false, message: "No trades found" });
        }

        res.status(200).json({ success: true, trades });
    } catch (error) {
        console.log("Error in getting Trades: ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
const updateTradeController = async (req, res) => {
    try {
        const { trade } = req.body;
        const { id } = req.params;

        // Validation
        if (!trade) {
            return res.send({ message: "Trade is Required" });
        }

        // Find and update the trade by ID
        const updatedTrade = await TradeModel.findByIdAndUpdate(
            id,
            { trade },
            { new: true }
        );

        if (!updatedTrade) {
            return res.status(204).send({
                success: false,
                message: "Trade Not Found !!",
            });
        }

        res.status(200).send({
            success: true,
            message: "Trade Updated Successfully.",
            updatedTrade,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Updating Trade",
            error,
        });
    }
};

const deleteTradeController = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the trade by ID
        const deletedTrade = await TradeModel.findByIdAndDelete(id);

        if (!deletedTrade) {
            return res.status(204).send({
                success: false,
                message: "Trade Not Found !!",
            });
        }

        res.status(200).send({
            success: true,
            message: "Trade Deleted Successfully.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Deleting Trade",
            error,
        });
    }
};

const getSingleTradeController = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the trade by ID
        const trade = await TradeModel.findById(id);

        if (!trade) {
            return res.status(204).send({
                success: false,
                message: "Trade Not Found !!",
            });
        }

        res.status(200).send({
            success: true,
            trade,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Fetching Trade",
            error,
        });
    }
};



module.exports = {
    addTradeController, getAllTradesController, updateTradeController, deleteTradeController, getSingleTradeController
};