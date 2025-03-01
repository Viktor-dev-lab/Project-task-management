const express = require('express') 
const router = express.Router()

// Controller
const controller = require('../controllers/user.controller')

// Validate

// route
router.post("/register", controller.register);
router.post("/login", controller.login);

module.exports = router
