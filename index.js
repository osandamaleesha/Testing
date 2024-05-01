const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

const TodoTask = require("./model/TodoTask");
const User = require('./model/User');

// process.env.DB_CONNECT
mongoose.connect("mongodb+srv://osanda20220325:qE35HFSsFUgfpEQV@cluster0.2r3ddda.mongodb.net/")
    .then(() => {
        console.log("Connected to db!");
        app.listen(3000, () => console.log("Server Up and running"));
    })
    .catch((err) => {
        console.error(err);
    });

app.set("view engine", "ejs");
//app.use("/static", express.static('public'));
app.use('/public', express.static('public'));

app.get('/', async (req, res) => {
    try {
        const tasksresults = await TodoTask.find({},);
        // tasksresults.forEach(element => {
        //     console.log(element.content);
        // });
        res.render("todo.ejs", { todoTasks: tasksresults });
    } catch (err) {
        res.send(500, err);
        res.redirect("/");
    }
});

app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.send(500, err);
        res.redirect("/");
    }
})

app.route("/remove/:id").get(async (req, res) => {
    const id = req.params.id;
    await TodoTask.findByIdAndDelete(id);
    try {
        res.redirect("/")
    } catch (err) {
        res.send(500, err);
        res.redirect("/");

    }
})

app.route("/edit/:id").get(async (req, res) => {
    const id = req.params.id;
    try {
        const taskedit = await TodoTask.find({});
        res.render("todoEdit.ejs", { todoTasks: taskedit, idTask: id })
    } catch (err) {
        res.send(500, err)
    }
}).post(async (req, res) => {
    const id = req.params.id;
    await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
    try {
        res.redirect("/")
    } catch (err) {
        res.send(500, err)
        res.redirect("/")
    }
})

app.post('/testing', async (req, res) => {
    const user = new User({
        name : req.body.username,
        password : req.body.password
    });
    try {
        await user.save();
        res.send("Line 92");
        // res.redirect("/");
    } catch (err) {
        res.send(500, err);
        res.redirect("/");
    }
})