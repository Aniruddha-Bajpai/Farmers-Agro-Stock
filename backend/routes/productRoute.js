const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController");

const { isAuthenticatedUser, authoriseRoles } = require("../middleware/auth");

const router = express.Router();

// creating routes from here ...
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getProductDetails);

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authoriseRoles("admin"), createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authoriseRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authoriseRoles("admin"), deleteProduct);

router.route("/review").put(isAuthenticatedUser, createProductReview);
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);
module.exports = router;
