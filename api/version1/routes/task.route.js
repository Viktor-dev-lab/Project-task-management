const express = require('express') 
const router = express.Router()

const Task = require('../../../models/task.model.js')

// Validate

// route
router.get("/", async (req,res) => {
  const task = await Task.find({deleted: false});
  res.json(task)
});

module.exports = router
