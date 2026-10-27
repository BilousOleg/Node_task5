const { Router } = require('express');
const productsRouter = require('./productsRouter');
const clientsRouter = require('./clientsRouter');

const router = Router();

router.use('/products', productsRouter);
router.use('/clients', clientsRouter);

module.exports = router;
