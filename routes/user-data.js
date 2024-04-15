const express = require("express");
const router = express.Router();
const isAdminMiddleware = require("../middleware/is-admin.js");
const isLoggedIn = require("../middleware/is-logged-in.js");

const {
  getUserData,
  resetUserPassword,
  getAllUsersData,
  deleteUserData,
  getUserPlans,
} = require("../controllers/user-data.js");

const { register } = require("../controllers/register.js");
const userLogin = require("../controllers/login.js");
const getUserReferrals = require("../controllers/get-referrals");
const addNewPlan = require("../controllers/add-new-plan.js");
const getPlan = require("../controllers/get-plan.js");
const updatePlan = require("../controllers/update-plan.js");
const deletePlan = require("../controllers/delete-plan.js");
const verifyUser = require("../controllers/verify-user.js");
const {
  getUserDetails,
} = require("../controllers/get-user-details.js");
const {
  getTransactions,
  modifyUserTransaction,
} = require("../controllers/get-transactions.js");
const { upload } = require("../middleware/file-upload.js");
const {
  newUserTransaction,
} = require("../controllers/transaction.js");
const {
  addMegaResalesPlan,
  getMegaResalesPlan,
} = require("../controllers/add-mega-resales.js");
const modifyUserData = require("../controllers/modify-user-data.js");
const {
  getAllMegaResalesPlan,
} = require("../controllers/get-all-mega-resales.js");
const forgotPassword = require("../controllers/forgot-passsword.js");
const changePassword = require("../controllers/change-password.js");
const modifyAdvertFee = require("../controllers/advert-fee.js");
const getTransactionAdmin = require("../controllers/admin/get-transactions.js");
// USERS

router.route("/register").post(register);
router.route("/login").post(userLogin);
router.route("/reset-password").post(resetUserPassword);
router
  .route("/users")
  .get(isLoggedIn, getUserDetails)
  .patch(isLoggedIn, modifyUserData);
router
  .route("/transactions")
  .get(isLoggedIn, getTransactions)
  .post(isLoggedIn, upload.single("paymentFile"), newUserTransaction)
  .patch(isAdminMiddleware, modifyUserTransaction);

router
  .route("/plans")
  .post(isLoggedIn, addNewPlan)
  .get(isLoggedIn, getUserPlans);

router
  .route("/mrp")
  .post(isLoggedIn, addMegaResalesPlan)
  .get(isLoggedIn, getMegaResalesPlan);

router.route("/mrplans").get(isLoggedIn, getAllMegaResalesPlan);
router.route("/referrals").get(isLoggedIn, getUserReferrals);

router
  .route("/plans/:id")
  .get(getPlan)
  .patch(updatePlan)
  .delete(deletePlan);

router.route("/password").post(forgotPassword);
router.route("/change-password").post(changePassword);

// VERIFY USER

router.route("/verify-user").post(verifyUser);

// router.route("/verify-user").post(verifyUser);

// ADMIN USE

router.route("/get-all-users-data").get(getAllUsersData);
// router.route("/get-all-users-data").get(isAdminMiddleware, getAllUsersData);
router.route("/delete-user-data/:id").delete(deleteUserData);
// router.route("/delete-user-data/:id").delete(isAdminMiddleware, deleteUserData);
router
  .route("/advert-fee/:id")
  .patch(isAdminMiddleware, modifyAdvertFee);

router.route("/admin-tx").get(isAdminMiddleware, getTransactionAdmin);
// .get(isLoggedIn, isAdminMiddleware, getTransactions);
// PRODUCTION

module.exports = router;
