const { Router } = require('express');
const { validation, paginate } = require('../middleware');
const { phonesController } = require('../controllers');

const phonesRouter = Router();

phonesRouter
  .route('/')
  .post(phonesController.createPhone)
  .get(
    validation.validatePagination,
    paginate.pagination,
    phonesController.getPhones
  );

phonesRouter.use('/:id', validation.validateId);

phonesRouter
  .route('/:id')
  .get(phonesController.getPhoneById)
  .patch(phonesController.updatePhoneById)
  .delete(phonesController.deletePhoneById);

module.exports = phonesRouter;
