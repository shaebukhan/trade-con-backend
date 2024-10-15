const express = require("express");
const { requireSignIn } = require("../middlewares/authMiddleware");
const { verifyToken } = require("../middlewares/verifyToken");
const { getAllTradesController, addTradeController, updateTradeController, deleteTradeController, getSingleTradeController } = require("../controllers/tradeController");
const router = express.Router();

//add trade
router.post("/add-trade", requireSignIn, addTradeController);
router.get("/m-trades", getAllTradesController);
router.put("/:id", requireSignIn, updateTradeController);
router.delete("/:id", requireSignIn, deleteTradeController);
router.get("/:id", getSingleTradeController);



module.exports = router;