const { Router } = require('express');
const { validation } = require('../middleware');
const { reviewsController } = require('../controllers');

const reviewsRouter = Router();

reviewsRouter.use('/:id', validation.validateId('id'));

reviewsRouter
  .route('/:id')
  .get(reviewsController.getReviewById)
  .patch(validation.validateReviewOnUpdate, reviewsController.updateReviewById)
  .delete(reviewsController.deleteReviewById);

module.exports = reviewsRouter;
