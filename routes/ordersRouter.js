const { Router } = require('express');
const { validation } = require('../middleware');
const { ordersController } = require('../controllers');

const ordersRouter = Router();

ordersRouter.use('/:id', validation.validateId('id'));

ordersRouter
  .route('/:id/status')
  .patch(
    validation.validateOrderStatusOnChange,
    ordersController.changeOrderStatusByOrderId
  );

module.exports = ordersRouter;
