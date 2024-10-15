const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ReviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    profession: {
        type: String,
        required: true,

    },
    image: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    }
});

//Export the model
module.exports = mongoose.model('Reviews', ReviewSchema);