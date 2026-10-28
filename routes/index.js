const { Router } = require('express');
const productsRouter = require('./productsRouter');
const clientsRouter = require('./clientsRouter');
const reviewsRouter = require('./reviewsRouter');

const router = Router();

router.use('/products', productsRouter);
router.use('/clients', clientsRouter);
router.use('/reviews', reviewsRouter);

module.exports = router;
