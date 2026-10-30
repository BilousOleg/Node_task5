const { Router } = require('express');
const productsRouter = require('./productsRouter');
const clientsRouter = require('./clientsRouter');
const reviewsRouter = require('./reviewsRouter');
const ordersRouter = require('./ordersRouter');

const router = Router();

router.use('/products', productsRouter);
router.use('/clients', clientsRouter);
router.use('/reviews', reviewsRouter);
router.use('/orders', ordersRouter);

module.exports = router;
