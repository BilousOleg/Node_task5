const { Router } = require('express');
const { validation, paginate } = require('../middleware');
const { phonesController } = require('../controllers');

const phonesRouter = Router();

phonesRouter
  .route('/')
  .post(validation.validatePhoneOnCreate, phonesController.createPhone)
  .get(
    validation.validatePagination,
    paginate.pagination,
    phonesController.getPhones
  );

phonesRouter.use('/:id', validation.validateId);

phonesRouter
  .route('/:id')
  .get(phonesController.getPhoneById)
  .patch(validation.validatePhoneOnUpdate, phonesController.updatePhoneById)
  .delete(phonesController.deletePhoneById);

module.exports = phonesRouter;
