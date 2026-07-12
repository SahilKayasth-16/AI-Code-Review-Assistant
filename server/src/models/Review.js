import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"]
        },
        language: {
            type: String,
            required: [true, "Language is required"],
            enum: {
                values: ["HTML/CSS", "JavaScript", "Python"],
                message: "Language must be either HTML/CSS, JavaScript, or Python"
            }
        },
        code: {
            type: String,
            required: [true, "Code is required"]
        },
        reviewResult: {
            type: String,
            default: "Pending AI Review"
        },
        status: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
