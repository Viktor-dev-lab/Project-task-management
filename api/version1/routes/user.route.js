const express = require('express') 
const router = express.Router()

// Controller
const controller = require('../controllers/user.controller')

// Validate

// route
router.post("/register", controller.register);

module.exports = router
