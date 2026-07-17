import "dotenv/config";

import app from "./app.js";
import prisma from "./config/prisma.js";

//DATABASE CONNECTION
async function startServer() {
    try {
        await prisma.$connect();
        console.log("PostgreSQL Connected Successfully.");

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Database Connection Error: ", error.message);
        process.exit(1);
    }
}

const PORT = process.env.PORT || 4000;

startServer()