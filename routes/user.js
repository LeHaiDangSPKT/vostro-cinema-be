const express = require("express");
const router = express.Router();

const UserController = require("../controller/User");

router.get(
  "/findPhoneNumberAndEmailUserById/:id",
  UserController.findPhoneNumberAndEmailUserById
);
router.get(
  "/findProvisionalInvoiceLasted",
  UserController.findProvisionalInvoiceLasted
);
router.get("/findUserById/:id", UserController.findUserById);
router.get("/findBillByUserById/:id", UserController.findBillByUserById);
router.get("/findAllFeedback", UserController.findAllFeedback);

router.post("/signIn", UserController.signIn);
router.post("/logIn", UserController.logIn);
router.post("/logInOrSingInWithGoogle", UserController.logInOrSingInWithGoogle);
router.post("/sendLetter", UserController.sendLetter);
router.post("/resetPassword", UserController.resetPassword);
router.post("/provisionalInvoice", UserController.provisionalInvoice);
router.post("/findBill", UserController.findBill);
router.post("/feedback", UserController.feedback);

router.put("/officialInvoiceById/:id", UserController.officialInvoiceById);
router.put("/updateUserById/:id", UserController.updateUserById);
router.put("/deleteAccount/:id", UserController.deleteAccount);

module.exports = router;
