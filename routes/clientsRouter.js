const { Router } = require('express');
const { validation, paginate } = require('../middleware');
const { clientsController, reviewsController } = require('../controllers');
const clientFavoritesRouter = require('./clientFavoritesRouter');
const clientOrdersRouter = require('./clientOrdersRouter');

const clientsRouter = Router();

clientsRouter
  .route('/')
  .post(validation.validateClientOnCreate, clientsController.createClient)
  .get(
    validation.validatePagination,
    paginate.pagination,
    clientsController.getClients
  );

clientsRouter.use('/:id', validation.validateId('id'));

clientsRouter
  .route('/:id')
  .get(clientsController.getClientById)
  .patch(validation.validateClientOnUpdate, clientsController.updateClientById)
  .delete(clientsController.deleteClientById);

clientsRouter.post(
  '/:id/products/:productId/reviews',
  validation.validateId('productId'),
  validation.validateReviewOnCreate,
  reviewsController.createProductReviewById
);

clientsRouter.get(
  '/:id/reviews',
  validation.validatePagination,
  paginate.pagination,
  reviewsController.getClientReviews
);

clientsRouter.use('/:id/favorites', clientFavoritesRouter);
clientsRouter.use('/:id/orders', clientOrdersRouter);

module.exports = clientsRouter;
