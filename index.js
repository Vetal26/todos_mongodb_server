const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");  
const app = express();

const db = require("./db");
const Todo = require("./db/models/todo");

app.use(cors());

app.get("/todos", async (req, res, next) => {
    try {
        const todos = await Todo.find();
        res.send(todos);
    } catch (error) {
        next(error)
    }
});

app.post("/todos", bodyParser.json(), async (req, res, next) => {
    const todo = new Todo({
        title: req.body.title,
        position: req.body.position,
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
        req.status(204).send();
    } catch (error) {
        res.status(404).send({ message: "Todo doesn't exist!" });
    }
});

app.delete("/todos", async (req, res) => {
    try {
        await Todo.deleteMany({ isDone: true });
        req.status(204).send();
    } catch (error) {
        res.status(404).send({ message: "Todo(s) doesn't exist!" });
    }
});

app.patch("/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id });
        todo.isDone = !todo.isDone;
        await todo.save();
        res.send(todo)
    } catch (error) {
        res.status(404).send({ message: "Todo doesn't exist!" });
    }
});

app.use(function (req, res) {
    res.status(404).send({ message: "PAGE NOT FOUND!" });
});

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});

//===============================

app.listen(5555, () => {
    console.log("Node server started, PORT: 5555");
});
