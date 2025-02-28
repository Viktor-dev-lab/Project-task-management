const taskRoutes = require('./task.route')

// Address
const systemConfig = require('../../../config/system.js');

module.exports = (app) => {
  const PATH_VERSION1= systemConfig.version1;

    // After route 
    app.use(PATH_VERSION1 + '/task', taskRoutes)
}

