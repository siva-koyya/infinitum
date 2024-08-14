const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Auto-generated ID
    path: { type: String, required: true }, // File path
    createdAt: { type: Date, default: Date.now } // Date and time of upload
});

const eventSchema = new mongoose.Schema({
    eventname: { type: String, required: true },
    user: { type: String, required: true },
    images: [fileSchema],
    videos: [fileSchema]
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
