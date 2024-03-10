const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost/todoDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// const todoSchema = new mongoose.Schema({
//     task: String,
//     completed: Boolean,
// });

//added validations in the mongodb schema
const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: [true, 'Task is required'],
        minLength: [3, 'Task must be atleast 3 characters long']
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const Todo = mongoose.model('Todo', todoSchema);

app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

// app.post('/todos', async (req, res) => {
//     console.log(req.body);
//     const todo = new Todo({
//         task: req.body.task,
//         completed: false,
//     });
//     console.log(todo);
//     await todo.save();
//     res.status(201).json(todo);
// });

//added try catch block to handle invalid request
app.post('/todos', async (req, res) => {
    const todo = new Todo({
        task: req.body.task
    });

    try{
        await todo.save();
        res.status(201).json(todo);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/todos/:id', async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        { completed: req.body.completed },
        { new: true }
    );
    res.json(todo);
});

app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is runnning on port ${PORT}`);
});