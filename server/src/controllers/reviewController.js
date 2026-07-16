import mongoose from "mongoose";

import Review from "../models/Review.js";
import analyzeCode from "../utils/analyzeCode.js";
import generateAIReview from "../services/ollamaService.js";
import generateReviewPrompt from "../utils/reviewPrompt.js";

// CREATE REVIEW API
export const createReview = async (req, res) => {
    try {
        const { language, code } = req.body;
        

        // 1. Validation
        if (!language) {
            return res.status(400).json({
                success: false,
                message: "Language is required."
            });
        }

        const allowedLanguages = ["HTML/CSS", "JavaScript", "Python"];
        if (!allowedLanguages.includes(language)) {
            return res.status(400).json({
                success: false,
                message: "Invalid language. Allowed languages are HTML/CSS, JavaScript, Python only."
            });
        }

        if (!code || code.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Code is required and cannot be empty."
            });
        }

        let analysis = [];

        if (language === "JavaScript") {
            try {
                analysis = await analyzeCode(code);
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Static code analysis failed."
                });
            }
        }

        // Generate AI Prompt
        const prompt = generateReviewPrompt(language, code, analysis);

        // Get AI Review from Gemini
        let aiReview;

        try {
            aiReview = await generateAIReview(prompt);

            if (!aiReview || typeof aiReview !== "object") {
                return res.status(500).json({
                    success: false,
                    message: "Invalid AI response"
                })
            }
        } catch (error) {
            console.error("Gemini Error: ", error);

            return res.status(500).json({
                success: false,
                message: "AI Code Review Failed.",
                error: error.message
            });
        }

        let newReview;

        try {
            newReview = await Review.create({
                user: req.user._id,
                language,
                code,
                analysis,
                aiReview,
                status: "Completed"
            });
        } catch(error) {
            return res.status(500).json({
                success: false,
                message: "Failed to save reivew."
            });
        }

        res.status(201).json({
            success: true,
            message: "Review Submitted Successfully !!",
            review: newReview,
            analysis,
            aiReview
        });

    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while creating the review."
        });
    }
};

// GET REVIEW HISTORY API
export const getReviewHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch reviews associated with logged-in user, sorted newest first
        const reviews = await Review.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            reviews
        });
    } catch (error) {
        console.error("Error fetching review history:", error);
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while retrieving review history."
        });
    }
};

// GET SINGLE REVIEW API
export const getReivewById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID."
            });
        }

        const review = await Review.findOne({
            _id: id,
            user: req.user._id
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Reivew not found"
            });
        }

        res.status(200).json({
            success: true,
            review
        });
    } catch(error) {
        console.error(`Error in fetching review, ${error}`);

        res.status(500).json({
            success: false,
            message: error.message || "An error occured while fetching review."
        });
    }
};

//DELETE REVIEW API
export const deleteReview = async(req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID."
            });
        }

        const review = await Review.findOne({
            _id: id,
            user: req.user._id
        });

        if (!review) {
            return res.status(404).json({
                success:false,
                message: "Review not found."
            });
        }

        await review.deleteOne();

        return res.status(200).json({
            success:true,
            message: "Review Deleted Successfully."
        });
    } catch(error) {
        console.error("Error in deleting review:", error);

        return res.status(500).json({
            success: false,
            message: "An error occured while deleting review."
        });
    }
};