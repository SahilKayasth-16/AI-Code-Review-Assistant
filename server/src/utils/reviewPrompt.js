const generateReviewPrompt = (language, code, analysis = []) => {
    return `
        You are an expert Senior Software Engineer and Code Reviewer.

        Analyze the following ${language} code carefully.

        Also consider these ESLint findings:

        ${JSON.stringify(analysis, null, 2)}

        Your job is to review the code professionally and provide:

        1. Bug Detection
        2. Code Smells
        3. Code Complexity Analysis
        4. Naming Convention Review
        5. Optimization Suggestions
        6. Documentation Suggestions
        7. Overall Quality Score (0-100)

        IMPORTANT RULES:

        - Return ONLY valid JSON.
        - Do NOT return Markdown.
        - Do NOT use \`\`\`json.
        - Do NOT explain anything outside the JSON.
        - Every field must be present.
        - If no bugs or code smells exist, return empty arrays.

        Required JSON structure:

        {
        "summary": "",
        "bugs": [
            {
            "title": "",
            "severity": "",
            "description": ""
            }
        ],
        "codeSmells": [
            {
            "title": "",
            "severity": "",
            "description": ""
            }
        ],
        "complexity": "",
        "naming": "",
        "optimization": [
            ""
        ],
        "documentation": [
            ""
        ],
        "overallScore": 0
        }

        Code: ${code}
    `;
};

export default generateReviewPrompt;