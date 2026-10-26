module.exports.pagination = (req, res, next) => {
  const { page = 1, results = 10 } = req.query;

  req.pagination = {
    page,
    limit: Number(results),
    skip: (page - 1) * results,
  };

  next();
};
