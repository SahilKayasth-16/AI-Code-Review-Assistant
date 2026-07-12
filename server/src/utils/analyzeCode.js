import { ESLint } from "eslint";

const eslint = new ESLint();

const analyzeCode = async (code) => {
    try {
        const result = await eslint.lintText(code);

        const messages = result[0].messages.map((message) => ({
            ruleId: message.ruleId || "Unknown",
            severity: message.severity,
            message: message.message,
            line: message.line,
            column: message.column
        }));

        return messages
    } catch(error) {
        throw new Error(`Code Analysis Failed due to ${error.message}.`);
    }
};

export default analyzeCode;