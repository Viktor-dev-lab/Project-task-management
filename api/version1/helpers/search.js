module.exports = (req) => {
  let objectSearch =  {
      keyword: "",
  }
  if (req.query.keyword) {
      objectSearch.keyword = req.query.keyword;
      // Sử dụng RegExp để tìm kiếm chuỗi con 
      const regex = new RegExp(objectSearch.keyword, "i"); // tham số i là không phân biệt chữ hoa thường
      objectSearch.title = regex;
  }
  return objectSearch;
}