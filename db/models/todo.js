const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    title: { type: String, required: true },
    isDone: { type: Boolean, required: true, default: false },
    position: { type: String, required: true}
});

module.exports = mongoose.model("Todo", TodoSchema);
