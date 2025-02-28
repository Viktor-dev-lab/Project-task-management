const Task = require('../models/task.model.js')


// Helpers
const paginationHelpers = require("../helpers/pagination.js");
const searchHelpers = require("../helpers/search.js");


// [GET] api/v1/tasks
module.exports.index = async (req, res) => {
  // Bộ Lọc theo status
  // api/v1/tasks?status=''
  const find = {
    deleted: false
  }
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Bộ lọc tìm kiếm
  const objectSearch = searchHelpers(req);
  if (objectSearch.keyword) {
    find.title = objectSearch.title;
  }

  // Phân Trang
  const countProducts = await Task.countDocuments(find); // Đếm tổng số sản phẩm
  // Chức năng phân trang
  let Pagination = paginationHelpers({
      currentPage: 1,
      limitItem: 2
    },
    req,
    countProducts
  );

  // Sort
  // api/v1/tasks?sortKey=''&sortValue=''
  const sort = {}
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }

  const tasks = await Task
    .find(find)
    .sort(sort)
    .limit(Pagination.limitItem)
    .skip(Pagination.skip);

  res.json(tasks);
}

// [GET] api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({
      _id: id,
      deleted: false
    });
    res.json(task);
  } catch (err) {
    res.json("Không tìm thấy !");
  }
}

// [PATCH] api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    await Task.updateOne(
      {_id: id},
      {status: status},
    )

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công"
    })
  } catch (err) {
    res.json("Không tìm thấy !");
  }
}