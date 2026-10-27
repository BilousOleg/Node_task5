const createHttpError = require('http-errors');
const { Client, Product } = require('../models');

module.exports.createClient = async (req, res, next) => {
  const { password, ...clientData } = req.body;

  try {
    const createdClient = await Client.create({
      ...clientData,
      passwHash: password,
    });

    if (!createdClient) {
      return next(createHttpError(400, 'Bad Request'));
    }

    res.status(201).send({ data: createdClient });
  } catch (err) {
    next(err);
  }
};

module.exports.getClients = async (req, res, next) => {
  const { limit, skip } = req.pagination;

  try {
    const foundClients = await Client.find()
      .sort({ _id: 1 })
      .limit(limit)
      .skip(skip);

    res.status(200).send({ data: foundClients });
  } catch (err) {
    next(err);
  }
};

module.exports.getClientById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const foundClient = await Client.findById(id);

    if (!foundClient) {
      return next(createHttpError(404, 'Client Not Found'));
    }

    res.status(200).send({ data: foundClient });
  } catch (err) {
    next(err);
  }
};

module.exports.updateClientById = async (req, res, next) => {
  const {
    params: { id },
    body,
  } = req;

  try {
    const updatedClient = await Client.findByIdAndUpdate(id, body, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!updatedClient) {
      return next(createHttpError(404, 'Client Not Found'));
    }

    res.status(200).send({ data: updatedClient });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteClientById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      return next(createHttpError(404, 'Client Not Found'));
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports.getClientFavoritesById = async (req, res, next) => {
  const {
    params: { id },
    pagination: { limit, skip },
  } = req;

  try {
    const foundClient = await Client.findById(id)
      .select({
        favoriteProducts: { $slice: [skip, limit] },
      })
      .populate(
        'favoriteProducts',
        'productName description category price discount count'
      );

    if (!foundClient) {
      return next(createHttpError(404, 'Client Not Found'));
    }

    res.status(200).send({
      data: foundClient.favoriteProducts,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.addClientFavoriteById = async (req, res, next) => {
  const { id, productId } = req.params;

  try {
    const foundProduct = await Product.findById(productId).select('_id');

    if (!foundProduct) {
      return next(createHttpError(404, 'Product Not Found'));
    }

    const foundClient = await Client.findByIdAndUpdate(
      id,
      { $addToSet: { favoriteProducts: foundProduct._id } },
      {
        returnDocument: 'after',
        runValidators: true,
      }
    ).select('favoriteProducts');

    if (!foundClient) {
      return next(createHttpError(404, 'Client Not Found'));
    }

    res.status(200).send({ data: foundClient.favoriteProducts });
  } catch (err) {
    next(err);
  }
};

module.exports.removeClientFavoriteById = async (req, res, next) => {
  const { id, productId } = req.params;

  try {
    const foundClient = await Client.findByIdAndUpdate(
      id,
      { $pull: { favoriteProducts: productId } },
      {
        returnDocument: 'after',
        runValidators: true,
      }
    ).select('favoriteProducts');

    if (!foundClient) {
      return next(createHttpError(404, 'Client Not Found'));
    }

    return res.status(200).send({
      data: foundClient.favoriteProducts,
    });
  } catch (err) {
    return next(err);
  }
};
