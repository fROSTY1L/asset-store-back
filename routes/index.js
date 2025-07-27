const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload")
const authController = require("../controllers/authController");
const modelController = require("../controllers/modelController");
const cartController = require("../controllers/cartController");
const purchaseController = require("../controllers/purchaseController");

/*Auth routes */
router.post("/auth/telegram", authController.telegramLogin);

/*Model routes */
router.get("/models", modelController.getAllModels);
router.get("/models/:slug", modelController.getModelBySlug);
router.post("/models", modelController.createModel);
router.post("/models/:id/upload", upload.single('model'), modelController.uploadModel);

/*Cart routes */
router.get("/cart", cartController.getCart);
router.post("/cart", cartController.addToCart);
router.delete("/cart:id", cartController.removeFromCart);

/*Purchase routes */
router.get("/purchases", purchaseController.getUserPurchases);
router.post("/purchases", purchaseController.createPurchase);

module.exports = router;