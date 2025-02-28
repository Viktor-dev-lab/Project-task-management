const express = require('express') 
const router = express.Router()

// Controller
const controller = require('../controllers/task.controller')

// Validate

// route
router.get("/", controller.index);
router.get("/detail/:id", controller.detail);
router.patch("/change-status/:id", controller.changeStatus);

module.exports = router
