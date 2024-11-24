const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  endpoint: { type: String, required: true },
  keys: {
    auth: { type: String, required: true },
    p256dh: { type: String, required: true },
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
