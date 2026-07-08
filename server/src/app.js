import express from "express";
import cors from "cors";

const app = express();

//THIS IS MIDDLE WARE
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AI Code Review Assistant API is running successfully."
    });
});

export default app;