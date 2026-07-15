import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

//DATABASE CONNECTION
connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});