const Order = require("../models/orderModels");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsynErrors = require("../middleware/catchAsyncErrors");

// ----> new order
exports.newOrder = catchAsynErrors(async function (req, res, next) {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// ----> get single order
exports.getSingleOrder = catchAsynErrors(async function (req, res, next) {
  // ---> populate will use the user schema and retrieve the user name and email
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// ----> logged in user orders
exports.myOrder = catchAsynErrors(async function (req, res, next) {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// ----> get all order admin
exports.getAllOrders = catchAsynErrors(async function (req, res, next) {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// ----> update order status admin
exports.updateOrder = catchAsynErrors(async function (req, res, next) {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 404));
  }
  // ----> this would update the stock for all the order present
  order.orderItems.forEach(async function (o) {
    await updateStock(o.product, o.quantity);
  });
  order.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// -----> delete order admin
exports.deleteOrder = catchAsynErrors(async function (req, res, next) {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }
  await order.deleteOne();
  res.status(200).json({
    success: true,
  });
});
