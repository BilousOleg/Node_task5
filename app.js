const express = require('express');
const { errorHandlers } = require('./middleware');

const app = express();

app.use(express.json());

app.use(errorHandlers.validationErrorHandler, errorHandlers.errorHandler);

module.exports = app;
