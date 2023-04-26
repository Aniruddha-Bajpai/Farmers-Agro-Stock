const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

// Create Product
exports.createProduct = catchAsyncErrors(async function (req, res, next) {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get all product
exports.getAllProducts = catchAsyncErrors(async function (req, res, next) {
  // return next(new ErrorHandler("Error Wooo!", 500));
  const resultPerPage = 8;
  const productCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter() // creating search functionality constructor..
    .pagination(resultPerPage);
  // let products = await apiFeatures.query;

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    // filteredProductsCount,
  });
});

// Update Product  admin
exports.updateProduct = catchAsyncErrors(async function (req, res, next) {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete product admin
exports.deleteProduct = catchAsyncErrors(async function (req, res, next) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// GET PRODUCT DETAILS : (to get product details for single product)
exports.getProductDetails = catchAsyncErrors(async function (req, res, next) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

exports.createProductReview = catchAsyncErrors(async function (req, res, next) {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  ); // ---> if same id then already reviewed alse not reviewed

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      // ---> modifying the previous review over the new review
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// --> get all the reviews of a product
exports.getProductReviews = catchAsyncErrors(async function (req, res, next) {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.deleteReview = catchAsyncErrors(async function (req, res, next) {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  // ---> all reviews which we dont want to delete
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const rating = avg / reviews.length;
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      rating,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
  });
});
