
const mongoose = require('mongoose');
// Declare the Schema of the Mongo model
var subtradeSchema = new mongoose.Schema({
    profession: {
        type: String,
        trim: true
    },
    image: {
        type: String,


    },
    tradeID: {
        type: mongoose.ObjectId,
        ref: "Trades",

    },

}, { timestamps: true });

//Export the model
module.exports = mongoose.model('SubTrades', subtradeSchema);