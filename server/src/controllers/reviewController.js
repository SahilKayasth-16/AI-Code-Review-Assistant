import prisma from "../config/prisma.js";
import analyzeCode from "../utils/analyzeCode.js";
import generateAIReview from "../services/ollamaService.js";
import generateReviewPrompt from "../utils/reviewPrompt.js";

const mapReviewResponse = (review) => {
    if (!review) return null;
    return {
        ...review,
        _id: review.id
    };
};

// CREATE REVIEW API
export const createReview = async (req, res) => {
    try {
        const { language, code, fileName } = req.body;
        const mappedLanguage = language === "HTML/CSS" ? "HTML_CSS" : language;

        // 1. Validation
        if (!language) {
            return res.status(400).json({
                success: false,
                message: "Language is required."
            });
        }

        const allowedLanguages = ["HTML_CSS", "JavaScript", "Python"];
        if (!allowedLanguages.includes(mappedLanguage)) {
            return res.status(400).json({
                success: false,
                message: "Invalid language. Allowed languages are HTML_CSS, JavaScript, Python only."
            });
        }

        if (!code || code.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Code is required and cannot be empty."
            });
        }

        let analysis = [];

        if (mappedLanguage === "JavaScript") {
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
        const prompt = generateReviewPrompt(mappedLanguage, code, analysis);

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
            newReview = await prisma.review.create({
                data: {
                    userId: req.user.id,
                    language: mappedLanguage,
                    code,
                    analysis,
                    reviewResult: aiReview,
                    status: "Completed",
                    fileName: fileName || null
                }
            });
        } catch(error) {
            console.error("Prisma Review Create Error:");
            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Failed to save review."
            });
        }

        res.status(201).json({
            success: true,
            message: "Review Submitted Successfully !!",
            review: mapReviewResponse(newReview),
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
        const userId = req.user.id;

        const reviews = await prisma.review.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json({
            success: true,
            reviews: reviews.map(mapReviewResponse)
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
export const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await prisma.review.findFirst({
            where:{
                id,
                userId: req.user.id
            }
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        res.status(200).json({
            success: true,
            review: mapReviewResponse(review)
        });
    } catch(error) {
        console.error(`Error in fetching review, ${error}`);

        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while fetching review."
        });
    }
};

//DELETE REVIEW API
export const deleteReview = async(req, res) => {
    try {
        const { id } = req.params;

        const review = await prisma.review.findFirst({
            where:{
                id,
                userId:req.user.id
            }
        });

        if (!review) {
            return res.status(404).json({
                success:false,
                message: "Review not found."
            });
        }

        await prisma.review.delete({
            where: {
                id
            }
        });

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