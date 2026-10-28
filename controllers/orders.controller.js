const createHttpError = require('http-errors');
const { Order, Client, Product } = require('../models');

module.exports.createClientOrder = async (req, res, next) => {
  const {
    params: { id },
    body: { items },
  } = req;

  try {
    const foundClient = await Client.findById(id);

    if (!foundClient) {
      return next(createHttpError(404, 'Client Not Found'));
    }

    if (foundClient.status === 'deleted') {
      return next(
        createHttpError(403, 'Cannot Create Order for Deleted Client')
      );
    }

    const orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const foundProduct = await Product.findById(item.productId);

      if (!foundProduct) {
        return next(createHttpError(404, 'Product Not Found'));
      }

      if (foundProduct.count < item.quantity) {
        return next(createHttpError(400, 'Not enough products in stock'));
      }

      orderItems.push({
        productId: foundProduct._id,
        productName: foundProduct.productName,
        quantity: item.quantity,
        unitPrice: foundProduct.price,
      });

      totalPrice += Number(foundProduct.price.toString()) * item.quantity;
    }

    const createdOrder = await Order.create({
      clientId: foundClient._id,
      items: orderItems,
      totalPrice: totalPrice.toFixed(2),
    });

    res.status(201).send({ data: createdOrder });
  } catch (err) {
    next(err);
  }
};

module.exports.getClientOrdersById = async (req, res, next) => {
  const {
    params: { id },
    pagination: { limit, skip },
  } = req;

  try {
    const foundClient = await Client.findById(id);

    if (!foundClient) {
      return next(createHttpError(404, 'Client Not Found'));
    }

    const foundOrders = await Order.find({ clientId: id }, { updatedAt: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ data: foundOrders });
  } catch (err) {
    next(err);
  }
};

module.exports.getClientOrderByOrderId = async (req, res, next) => {
  const { id, orderId } = req.params;

  try {
    const foundClient = await Client.findById(id);

    if (!foundClient) {
      return next(createHttpError(404, 'Client Not Found'));
    }

    const foundOrder = await Order.findOne({
      _id: orderId,
      clientId: id,
    });

    if (!foundOrder) {
      return next(createHttpError(404, 'Order Not Found'));
    }

    res.status(200).send({ data: foundOrder });
  } catch (err) {
    next(err);
  }
};

module.exports.cancelClientOrderByOrderId = async (req, res, next) => {
  const { id, orderId } = req.params;

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        clientId: id,
        status: 'new',
      },
      {
        $set: { status: 'cancelled' },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      return next(
        createHttpError(404, 'Order Not Found or Cannot Be Cancelled')
      );
    }

    res.status(200).send({ data: updatedOrder });
  } catch (err) {
    next(err);
  }
};

// TODO change order status controller
