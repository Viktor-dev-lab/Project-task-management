const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    status: {
        type: String,
        enum: ["initial", "doing", "finish", "pending", "notFinish"],
        default: "initial"
    },
    content: String,
    timeStart: Date,
    timeFinish: Date,
    createdBy: String,
    listUsers: Array,
    taskParentID: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
}, {
    timestamps: true
});

const Tasks = mongoose.model("Tasks", taskSchema, "tasks");

module.exports = Tasks;
