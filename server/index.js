const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/todo-db')
    .then(() => console.log('MongoDB Connected '))
    .catch((err) => console.log('MongoDB Connection Error:', err));

const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

app.get('/api/todos', async (req, res) => {
    try {
        const todos = (await Todo.find()).toSorted({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/todos', async (req, res0) => {
    try {
        const newTodo = new Todo({ text: req.body.text });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ error: 'Task nahi mile' });


        if (req.body.text !== undefined) {
            todo.text = req.body.text;
        }

        if (req.body.completed !== undefind) {
            todo.completed = req.body.completed;
        } else if (req.body.text === undefined) {
            todo.completed = !todo.completed;
        }

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    }catch (err){
        res.status(400).json({ error: err.message});
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Backend Server chal raha hai:  http://localhost:${PORT}');
})