const mongoose = require('mongoose');
const _ = require('lodash');
const createHttpError = require('http-errors');
const { Phone, User } = require('../models');

module.exports.createPhone = async (req, res, next) => {
  const { body } = req;

  try {
    const createdPhone = await Phone.create(body);

    if (!createdPhone) {
      return next(createHttpError(400, 'Bad Request'));
    }

    res.status(201).send({ data: createdPhone });
  } catch (err) {
    next(err);
  }
};

module.exports.getPhones = async (req, res, next) => {
  const { limit = 10, skip = 0 } = req.pagination;

  try {
    const foundPhones = await Phone.find()
      .sort({ _id: 1 })
      .limit(limit)
      .skip(skip);

    res.status(200).send({ data: foundPhones });
  } catch (err) {
    next(err);
  }
};

module.exports.getPhoneById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const foundPhone = await Phone.findById(id);

    if (!foundPhone) {
      return next(createHttpError(404, 'Phone Not Found'));
    }

    res.status(200).send({ data: foundPhone });
  } catch (err) {
    next(err);
  }
};

module.exports.updatePhoneById = async (req, res, next) => {
  const {
    params: { id },
    body,
  } = req;

  try {
    const updatedPhone = await Phone.findByIdAndUpdate(id, body, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!updatedPhone) {
      return next(createHttpError(404, 'Phone Not Found'));
    }

    res.status(200).send({ data: updatedPhone });
  } catch (err) {
    next(err);
  }
};

module.exports.deletePhoneById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedPhone = await Phone.findByIdAndDelete(id);

    if (!deletedPhone) {
      return next(createHttpError(404, 'Phone Not Found'));
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports.createUserPhone = async (req, res, next) => {
  const {
    params: { id },
    body,
  } = req;

  try {
    const foundUser = await User.findById(id);

    if (!foundUser) {
      return next(createHttpError(404, 'User Not Found'));
    }

    const newPhone = { ...body, userId: new mongoose.Types.ObjectId(id) };
    const createdPhone = await Phone.create(newPhone);

    if (!createdPhone) {
      return next(createHttpError(400, 'Bad Request'));
    }

    const preparedPhone = _.omit(createdPhone.toObject(), ['updatedAt']);

    res.status(201).send({ data: preparedPhone });
  } catch (err) {
    next(err);
  }
};

module.exports.getUserPhones = async (req, res, next) => {
  const {
    params: { id },
    pagination: { limit, skip },
  } = req;

  try {
    const foundPhones = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'phones',
          localField: '_id',
          foreignField: 'userId',
          as: 'userPhones',
        },
      },
      {
        $project: {
          _id: 0,
          userPhones: { $slice: ['$userPhones', skip, limit] },
        },
      },
    ]);

    if (!foundPhones.length) {
      return next(createHttpError(404, 'User Not Found'));
    }

    const userPhones = foundPhones[0].userPhones.map(phone => ({
      ...phone,
      screenDiagonal:
        phone.screenDiagonal == null
          ? phone.screenDiagonal
          : Number(phone.screenDiagonal.toString()),
    }));

    res.status(200).send({ data: userPhones });
  } catch (err) {
    next(err);
  }
};
