import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();

//THIS IS MIDDLE WARE
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

//TEST ROUTES
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AI Code Review Assistant API is running successfully."
    });
});

export default app;