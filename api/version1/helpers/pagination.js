module.exports = (objectPagination, req, countItem) => {
  if (req.query.page) {
    objectPagination.currentPage = parseInt(req.query.page);
  }

  if (req.query.limit) {
    objectPagination.limitItem = parseInt(req.query.limit);
  }

  objectPagination.skip = (objectPagination.currentPage - 1) * (objectPagination.limitItem); // Công thức phân trang

  const totalPage = Math.ceil(countItem / objectPagination.limitItem); // Tính tổng trang
  objectPagination.totalPage = totalPage; // Thêm vào object
  return objectPagination;
}