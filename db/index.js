const mongoose = require("mongoose");

const mongoDB = require("./config.json")[process.env.NODE_ENV].db;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = db;