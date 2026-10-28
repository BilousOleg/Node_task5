const { Router } = require('express');
const { validation, paginate } = require('../middleware');
const { ordersController } = require('../controllers');

const clientOrdersRouter = Router({ mergeParams: true });

clientOrdersRouter
  .route('/')
  .post(validation.validateOrderOnCreate, ordersController.createClientOrder)
  .get(
    validation.validatePagination,
    paginate.pagination,
    ordersController.getClientOrdersById
  );

clientOrdersRouter.use('/:orderId', validation.validateId('orderId'));

clientOrdersRouter
  .route('/:orderId')
  .get(ordersController.getClientOrderByOrderId);

clientOrdersRouter.patch(
  '/:orderId/cancel',
  ordersController.cancelClientOrderByOrderId
);

module.exports = clientOrdersRouter;
