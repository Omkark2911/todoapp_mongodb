const express = require("express");
const jwt = require("jsonwebtoken");
const { todoModel, userModel } = require("./models");
const { authMiddleware } = require("./middleware");
const app = express();
app.use(express.json());



app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userexists = await userModel.findOne({
        username: username,
        password: password
    });
    if (userexists) {
        res.status(403).json({
            message: "user with this username already exists"
        })
        return
    }

    const newUser = await userModel.create({
        username: username,
        password: password
    })

    res.json({
        id: newUser._id
    });
})

app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existuser = await userModel.findOne({
        username: username,
        password: password
    });

    if (!existuser) {
        return res.status(403).json({
            message: "invalid creditials"
        })
    }
    const token = jwt.sign({      // jwt.sign() creates a JWT token
        userId: existuser._id
    }, "secret123123");

    res.json({
        token
    })
})

app.post("/todo", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const title = req.body.title;
    const description = req.body.description;


    const todo = await todoModel.create({
        title: title,
        description: description,
        userId: userId
    })
    res.json({
        message: "Todo made",
        id: todo._id
    })
})


app.delete("/todo/:todoId", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const todoId = req.params.todoId;

    const deletedTodo = await todoModel.findOneAndDelete({
        _id: todoId,
        userId: userId
    });

    if (!deletedTodo) {
        return res.status(403).json({
            message: "Either todo doesn't exist or this is not your todo"
        });
    }

    res.json({
        message: "Deleted"
    });
});

app.get("/todos", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const userTodos = await todoModel.find({ userId: userId });
    res.json({
        todos: userTodos
    })
})

app.listen(3004);