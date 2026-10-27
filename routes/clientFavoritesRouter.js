const { Router } = require('express');
const { validation, paginate } = require('../middleware');
const { clientsController } = require('../controllers');

const clientFavoritesRouter = Router({ mergeParams: true });

clientFavoritesRouter
  .route('/')
  .get(
    validation.validatePagination,
    paginate.pagination,
    clientsController.getClientFavoritesById
  );

clientFavoritesRouter.use('/:productId', validation.validateId);

clientFavoritesRouter
  .route('/:productId')
  .put(clientsController.addClientFavoriteById)
  .delete(clientsController.removeClientFavoriteById);

module.exports = clientFavoritesRouter;
