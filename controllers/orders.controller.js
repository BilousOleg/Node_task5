const createHttpError = require('http-errors');
const { Order, Client, Product } = require('../models');
const { ALLOWED_STATUS_TRANSITIONS } = require('../constants');

module.exports.createClientOrder = async (req, res, next) => {
  const {
    params: { id },
    body: { items },
  } = req;

  const deductedItems = [];

  let createdOrder;

  try {
    const foundClient = await Client.findById(id);

    if (!foundClient) {
      throw createHttpError(404, 'Client Not Found');
    }

    if (foundClient.status === 'deleted') {
      throw createHttpError(403, 'Cannot Create Order for Deleted Client');
    }

    const orderItems = [];
    let totalPriceInCents = 0;

    for (const item of items) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          count: { $gte: item.quantity },
        },
        {
          $inc: { count: -item.quantity },
        },
        {
          returnDocument: 'after',
          runValidators: true,
        }
      );

      if (!updatedProduct) {
        const foundProduct = await Product.findById(item.productId);

        if (!foundProduct) {
          throw createHttpError(404, 'Product Not Found');
        }

        throw createHttpError(400, 'Not Enough Products in Stock');
      }

      deductedItems.push({
        productId: updatedProduct._id,
        quantity: item.quantity,
      });

      const originalPriceInCents = Math.round(
        Number(updatedProduct.price.toString()) * 100
      );

      const discount = updatedProduct.discount ?? 0;

      const discountedPriceInCents = Math.round(
        originalPriceInCents * (1 - discount / 100)
      );

      orderItems.push({
        productId: updatedProduct._id,
        productName: updatedProduct.productName,
        quantity: item.quantity,
        originalUnitPrice: (originalPriceInCents / 100).toFixed(2),
        unitPrice: (discountedPriceInCents / 100).toFixed(2),
        discount,
      });

      totalPriceInCents += discountedPriceInCents * item.quantity;
    }

    createdOrder = await Order.create({
      clientId: foundClient._id,
      items: orderItems,
      totalPrice: (totalPriceInCents / 100).toFixed(2),
    });
  } catch (err) {
    // Компенсація товарів, які були списані, але відбулася помилка
    // і замовлення не створилося
    let rollbackFailed = false;

    for (const item of deductedItems) {
      try {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { count: item.quantity } }
        );
      } catch (rollbackError) {
        rollbackFailed = true;
        console.error('Stock rollback failed:', rollbackError);
      }
    }

    if (rollbackFailed) {
      return next(
        createHttpError(
          500,
          'Order Creation Failed. Stock Restoration Requires Manual Review'
        )
      );
    }

    return next(err);
  }

  res.status(201).send({ data: createdOrder });
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
        returnDocument: 'after',
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      return next(
        createHttpError(400, 'Order Not Found or Cannot Be Cancelled')
      );
    }

    res.status(200).send({ data: updatedOrder });
  } catch (err) {
    next(err);
  }
};

module.exports.changeOrderStatusByOrderId = async (req, res, next) => {
  const {
    params: { id },
    body: { status },
  } = req;

  try {
    const allowedCurrentStatuses = Object.keys(
      ALLOWED_STATUS_TRANSITIONS
    ).filter(currentStatus =>
      ALLOWED_STATUS_TRANSITIONS[currentStatus].includes(status)
    );

    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: id,
        status: { $in: allowedCurrentStatuses },
      },
      {
        $set: { status },
      },
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      return next(
        createHttpError(409, 'Order Not Found or Status Cannot Be Changed')
      );
    }

    res.status(200).send({ data: updatedOrder });
  } catch (err) {
    next(err);
  }
};
