
const mongoose = require('mongoose');
// Declare the Schema of the Mongo model
var tradeSchema = new mongoose.Schema({
    trade: {
        type: String,
        required: true,
        trim: true
    },


}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Trades', tradeSchema);