const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: "Eddi Hernández Vidal" },
    categories: { type: String, required: true},
    imageUrl: { type: String, default: null },
    datePosted: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
