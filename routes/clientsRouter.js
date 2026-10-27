const { Router } = require('express');
const { validation, paginate } = require('../middleware');
const { clientsController } = require('../controllers');
const clientFavoritesRouter = require('./clientFavoritesRouter');

const clientsRouter = Router();

clientsRouter
  .route('/')
  .post(validation.validateClientOnCreate, clientsController.createClient)
  .get(
    validation.validatePagination,
    paginate.pagination,
    clientsController.getClients
  );

clientsRouter.use('/:id', validation.validateId);

clientsRouter
  .route('/:id')
  .get(clientsController.getClientById)
  .patch(validation.validateClientOnUpdate, clientsController.updateClientById)
  .delete(clientsController.deleteClientById);

clientsRouter.use('/:id/favorites', clientFavoritesRouter);

module.exports = clientsRouter;
