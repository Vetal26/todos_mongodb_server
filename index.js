const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");  
const app = express();

const db = require("./db");
const Todo = require("./db/models/todo");

const config = require('./config.json')[process.env.NODE_ENV];
const { newPosition } = require('./utils/utils');

app.use(cors());

app.get("/todos", async (req, res, next) => {
    try {
        const todos = await Todo.find().sort({ position: 1});
        res.send(todos);
    } catch (error) {
        next(error);
    }
});

app.post("/todos", bodyParser.json(), async (req, res, next) => {
    const todo = new Todo({
        title: req.body.title,
        position: (new Date()).getTime().toString(36),
    });
    
    try {
        await todo.save();
        res.send(todo);
    } catch (error) {
        next(error);
    }
});

app.delete("/todos/:id", async (req, res) => {
    try {
        await Todo.deleteOne({ _id: req.params.id});
        res.status(204).send();
    } catch (error) {
        res.status(404).send({ message: "Todo doesn't exist!" });
    }
});

app.delete("/todos", async (req, res) => {
    try {
        await Todo.deleteMany({ isDone: true });
        res.status(204).send();
    } catch (error) {
        res.status(404).send({ message: "Todo(s) doesn't exist!" });
    }
});

app.patch("/todos", bodyParser.json(), async (req, res) => {
    const filter = req.body.id ? { _id: req.body.id } : {};

    try {
        await Todo.updateMany( filter, {$set: {isDone: req.body.isDone}})
        res.status(200).send();
    } catch (error) {
        res.status(404).send({ message: "Todo doesn't exist!" });
    }
});

app.patch('/dnd/:id', bodyParser.json(), async (req, res) => {
    try {
        const newPos = newPosition.apply(this, req.body)

        await Todo.updateOne({  _id: req.params.id }, {$set: {position: newPos}})
        res.send(newPos);
    } catch (error) {
        res.status(404).send({ message: "Todo doesn't exist!" });
    }
});

app.use((req, res) => {
    res.status(404).send({ message: "PAGE NOT FOUND!" });
});

app.use((err, req, res) => {
    res.status(500).send({ message: err.message });
});

//===============================

app.listen(config.port, () => {
    console.log(`Node server started, PORT: ${config.port}`);
});
