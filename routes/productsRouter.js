const { Router } = require('express');
const { validation, paginate } = require('../middleware');
const { productsController } = require('../controllers');

const productsRouter = Router();

productsRouter
  .route('/')
  .post(validation.validateProductOnCreate, productsController.createProduct)
  .get(
    validation.validatePagination,
    paginate.pagination,
    productsController.getProducts
  );

productsRouter.use('/:id', validation.validateId);

productsRouter
  .route('/:id')
  .get(productsController.getProductById)
  .patch(
    validation.validateProductOnUpdate,
    productsController.updateProductById
  )
  .delete(productsController.deleteProductById);

module.exports = productsRouter;
