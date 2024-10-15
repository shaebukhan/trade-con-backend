const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    profession: {
        type: mongoose.ObjectId,
        ref: "SubTrades",
    },
    companyName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    services: {
        type: [String],
        required: true
    },
    reviews: {
        type: String,
        required: true,

    },
    terms: {
        type: Boolean,
        required: true
    },
    notifications: {
        type: String,
        required: true,

    }, status: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Workers', workerSchema);
