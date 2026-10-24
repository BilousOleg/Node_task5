const { Router } = require('express');
const { validation, paginate } = require('../middleware');
const { phonesController } = require('../controllers');

const userPhonesRouter = Router({ mergeParams: true });

userPhonesRouter
  .route('/')
  .post(validation.validatePhoneOnCreate, phonesController.createUserPhone)
  .get(
    validation.validatePagination,
    paginate.pagination,
    phonesController.getUserPhones
  );

module.exports = userPhonesRouter;
