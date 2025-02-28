const Task = require('../models/task.model.js')

// [GET] api/v1/task
module.exports.index = async (req, res) => {
  // Tìm kiếm theo status
  // api/v1/tasks?status=''
  const find = {
    deleted: false
  }
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Sort
  // api/v1/tasks?sortKey=''&sortValue=''
  const sort = {}
  if (req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey] = req.query.sortValue;
  }

  const tasks = await Task.find(find).sort(sort);
  res.json(tasks);
}

// [GET] api/v1/task/detail/:id
module.exports.detail = async (req, res) => {
  try{
    const id = req.params.id;
    const task = await Task.findOne({
      _id: id,
      deleted: false
    });
    res.json(task);
  } catch(err){ 
    res.json("Không tìm thấy !");
  }
}