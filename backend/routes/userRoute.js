const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateUserProfile,
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");
const { isAuthenticatedUser, authoriseRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateUserProfile);
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authoriseRoles("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authoriseRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authoriseRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authoriseRoles("admin"), deleteUser);

module.exports = router;
