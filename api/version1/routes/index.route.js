const taskRoutes = require('./task.route')
const userRoutes = require('./user.route')

// Address
const systemConfig = require('../../../config/system.js');

// Middilwares
const authMiddleware = require('../middlewares/auth.middleware.js');

module.exports = (app) => {
  const PATH_VERSION1= systemConfig.version1;

    // After route 
    app.use(PATH_VERSION1 + '/tasks',authMiddleware.requireAuth, taskRoutes)
    app.use(PATH_VERSION1 + '/users', userRoutes)

}

