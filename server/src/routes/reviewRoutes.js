import express from "express";
import { createReview, getReviewHistory, getReivewById } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All review routes require authentication
router.use(protect);

router.post("/", createReview);
router.get("/", getReviewHistory);
router.get("/:id", getReivewById);

export default router;
