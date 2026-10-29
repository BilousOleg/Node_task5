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

      // Оновлення кількості товарів на складі
      // Може виникнути проблема, якщо хоча б один з товарів буде недоступний
      // (невірний productId, тощо). Скоріше за все, потрібна транзакція
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
          return next(createHttpError(404, 'Product Not Found'));
        }

        return next(createHttpError(400, 'Not enough products in stock'));
      }

      // Враховування знижки
      const originalPrice = Number(foundProduct.price.toString());
      const discount = foundProduct.discount ?? 0;

      const discountedPrice = Number(
        (originalPrice * (1 - discount / 100)).toFixed(2)
      );

      orderItems.push({
        productId: foundProduct._id,
        productName: foundProduct.productName,
        quantity: item.quantity,
        originalUnitPrice: originalPrice.toFixed(2),
        unitPrice: discountedPrice.toFixed(2),
        discount,
      });

      totalPrice += discountedPrice * item.quantity;
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
