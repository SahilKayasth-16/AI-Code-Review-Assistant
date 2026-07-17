import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const generateAIReview = async (prompt) => {
    try {
        const response = await groq.chat.completions.create({
            model: process.env.GROQ_MODEL,
            messages: [
                {
                    role: "user",
                    content: prompt
                },
            ],
            temperature: 0.2,
            response_format: {
                type: "json_object",
            },
        });

        const text = response.choices[0].message.content.trim();

        return JSON.parse(text);
    } catch(error) {
        throw new Error(`AI review failed: ${error.message}`);
    }
};

export default generateAIReview;