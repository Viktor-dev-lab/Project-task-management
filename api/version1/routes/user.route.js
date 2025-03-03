const express = require('express') 
const router = express.Router()

// Controller
const controller = require('../controllers/user.controller.js')

// Middilwares
const authMiddleware = require('../middlewares/auth.middleware.js');

// Validate

// route
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/password/forgot", controller.forgotPassword);
router.post("/password/otp", controller.otpPassword);
router.post("/password/reset", controller.resetPassword);
router.get("/detail", authMiddleware.requireAuth, controller.detail);

module.exports = router
