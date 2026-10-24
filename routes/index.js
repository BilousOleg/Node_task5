const { Router } = require('express');
const phonesRouter = require('./phonesRouter');
const usersRouter = require('./usersRouter');

const router = Router();

router.use('/phones', phonesRouter);
router.use('/users', usersRouter);

module.exports = router;
