const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authoriseRoles } = require("../middleware/auth");
const {
  newOrder,
  getSingleOrder,
  myOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router
  .route("/order/:id")
  .get(isAuthenticatedUser, authoriseRoles("admin"), getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrder);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authoriseRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authoriseRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authoriseRoles("admin"), deleteOrder);

module.exports = router;
