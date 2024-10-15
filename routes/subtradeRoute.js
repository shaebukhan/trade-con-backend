const express = require("express");
const router = express.Router();

const upload = require("../utilis/upload");
const { requireSignIn } = require("../middlewares/authMiddleware");
const { addSubTradeController, getAllSubTradesController, deleteSubTradeController, updateSubTradeController, getSingleSubTradeController, workersAddController, getAllworkersDetailsController } = require("../controllers/subTradeController");
const { getAllListingsController, updateListingController, deleteListingController } = require("../controllers/listingController");

// Define the route with file upload handling
router.post("/add-sub-trade", requireSignIn, upload.fields([{ name: "image", maxCount: 1 }])
    , addSubTradeController);

router.get("/sub-trades/:id", getAllSubTradesController);
router.get("/sub-trade/:id", getSingleSubTradeController);
router.put("/edit/:id", upload.fields([{ name: "image", maxCount: 1 }]), requireSignIn, updateSubTradeController);
router.delete("/delete/:id", requireSignIn, deleteSubTradeController);
router.post("/add-workers", workersAddController);
router.get("/get-workers/:id", getAllworkersDetailsController);
router.get("/all-listings", requireSignIn, getAllListingsController);
router.put("/worker-update/:id", requireSignIn, updateListingController);
router.delete("/worker-delete/:id", requireSignIn, deleteListingController);
module.exports = router;
