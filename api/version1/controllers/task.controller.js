const Task = require('../models/task.model.js')


// Helpers
const paginationHelpers = require("../helpers/pagination.js");
const searchHelpers = require("../helpers/search.js");


// [GET] api/v1/tasks
module.exports.index = async (req, res) => {
  // Bộ Lọc theo status
  // api/v1/tasks?status=''
  const find = {
    $or: [
      {createdBy: req.user.id},
      {listUsers:{ $in: [req.user.id] }}
    ],
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

// [PATCH] api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const {ids,key,value} = req.body;
    switch(key){
      case 'status':
        await Task.updateMany(
          {_id: {$in: ids},},
          {status: value}
        );
        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công !"
        });
        break;

      case 'delete':
        await Task.updateMany(
          {_id: {$in: ids},},
          {deleted: true, deletedAt: new Date()}
        );
        res.json({
          code: 200,
          message: "Xóa thành công !"
        });
        break;
      default:
        res.json({
          code: 400,
          message: "Không tồn tại"
        });
        break;
    }
   
    
  } catch (err) {
    res.json("Không tìm thấy !");
  }
}

// [POST] api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const task = new Task(req.body);
    const data = await task.save();

    res.json({
      code: 200,
      message: "Tạo thành công",
      data: data
    });
    
  } catch (err) {
    res.json({
      code: 400,
      message: "lỗi"
    });
  }
}

// [PATCH] api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne({_id :id}, req.body);

    res.json({
      code: 200,
      message: "Cập nhật thành công",
    });
    
  } catch (err) {
    res.json({
      code: 400,
      message: 'Lỗi'
    });
  }
}

// [DELETE] api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne(
      {_id :id}, 
      {deleted: true, deletedAt: new Date()}
    );

    res.json({
      code: 200,
      message: "Xóa thành công",
    });
    
  } catch (err) {
    res.json({
      code: 400,
      message: 'Lỗi'
    });
  }
}