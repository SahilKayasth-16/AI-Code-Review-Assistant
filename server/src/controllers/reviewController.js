import Review from "../models/Review.js";

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
                message: "Invalid language. Allowed values are HTML/CSS, JavaScript, Python."
            });
        }

        if (!code || code.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Code is required and cannot be empty."
            });
        }

        // 2. Create and Save Review record
        const newReview = await Review.create({
            user: req.user._id,
            language,
            code
        });

        res.status(201).json({
            success: true,
            message: "Review submitted successfully.",
            review: newReview
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
