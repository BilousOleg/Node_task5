const validateWithSchema = schema => {
  return async (req, res, next) => {
    const { body } = req;

    try {
      req.body = await schema.validate(body, { abortEarly: false });
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = validateWithSchema;
