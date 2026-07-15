import ollama from "ollama";

const generateAIReview = async (prompt) => {
    try {
        const response = await ollama.chat({
            model: process.env.OLLAMA_MODEL,
            format: "json",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const text = response.message.content.trim();

        const cleanedText = text.replace(/^```json\s*/i, "")
                                .replace(/^```\s*/i, "")
                                .replace(/\s*```$/i, "")
                                .trim();

        return JSON.parse(cleanedText);
    } catch(error) {
        throw new Error(`AI Review Failed: ${error.message}`);
    }
};

export default generateAIReview;