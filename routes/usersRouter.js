const { Router } = require('express');
const { validation, paginate } = require('../middleware');
const { usersController } = require('../controllers');
const userPhonesRouter = require('./userPhonesRouter');

const usersRouter = Router();

usersRouter
  .route('/')
  .post(validation.validateUserOnCreate, usersController.createUser)
  .get(
    validation.validatePagination,
    paginate.pagination,
    usersController.getUsers
  );

usersRouter.use('/:id', validation.validateId);

usersRouter.use('/:id/phones', userPhonesRouter);

module.exports = usersRouter;
