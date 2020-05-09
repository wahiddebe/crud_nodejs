const mongoose = require('mongoose');

const ToDoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const ToDo = mongoose.model('ToDo', ToDoSchema);

module.exports = ToDo;