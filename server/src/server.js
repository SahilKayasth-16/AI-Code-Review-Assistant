import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

//LOADING ENVIRONMENT VARIABLES
dotenv.config();

//DATABASE CONNECTION
connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});