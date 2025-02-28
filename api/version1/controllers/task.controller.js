const Task = require('../models/task.model.js')


// Helpers
const paginationHelpers = require("../helpers/pagination.js");


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

  // Phân Trang
  const countProducts = await Task.countDocuments(find); // Đếm tổng số sản phẩm
  // Chức năng phân trang
  let Pagination = paginationHelpers(
      {
          currentPage: 1,
          limitItem: 2
      },
      req,
      countProducts
  );

  // Sort
  // api/v1/tasks?sortKey=''&sortValue=''
  const sort = {}
  if (req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey] = req.query.sortValue;
  }

  const tasks = await Task
    .find(find)
    .sort(sort)
    .limit(Pagination.limitItem)
    .skip(Pagination.skip);

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