// No backend integration for now, just mock methods returning clean mock data.

export const submitCodeReview = async (code, language) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!code.trim()) {
        throw new Error("Code cannot be empty");
    }

    const issues = [];
    let bugsCount = 0;
    let warningsCount = 0;
    let suggestionsCount = 0;

    if (code.includes("var ") || code.includes("var\n")) {
        issues.push({
            line: 4,
            title: "Use of 'var' keyword",
            severity: "warning",
            description: "Using 'var' can lead to variable hoisting bugs. Prefer 'let' or 'const' for block scoping.",
            suggestion: "const x = 10; or let y = 20;"
        });
        warningsCount++;
    }

    if (code.includes("==") && !code.includes("===")) {
        issues.push({
            line: 8,
            title: "Loose comparison '==' used",
            severity: "bug",
            description: "Using '==' performs type coercion which can introduce silent bugs. Use strict equality '===' instead.",
            suggestion: "if (value === expected)"
        });
        bugsCount++;
    }

    if (code.includes("console.log")) {
        issues.push({
            line: 12,
            title: "Production console.log found",
            severity: "suggestion",
            description: "Avoid pushing console logging statement to production environments. Clean up or use a logging library.",
            suggestion: "// remove console.log or use logger.info()"
        });
        suggestionsCount++;
    }

    // Default suggestion if no other issues are detected
    if (issues.length === 0) {
        issues.push({
            line: 1,
            title: "Missing documentation",
            severity: "suggestion",
            description: "The file doesn't have an introductory block comment or JSDoc strings. Consider documenting the module purpose.",
            suggestion: "/**\n * Module description\n */"
        });
        suggestionsCount++;
    }

    const score = Math.max(50, 100 - (bugsCount * 15 + warningsCount * 8 + suggestionsCount * 4));

    return {
        summary: {
            score,
            bugs: bugsCount,
            warnings: warningsCount,
            suggestions: suggestionsCount
        },
        issues
    };
};

export const fetchReviewHistory = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600));

    return [
        {
            id: 1,
            file: "server.js",
            language: "JavaScript",
            date: "10 Jul 2026",
            issues: 8,
            status: "Completed"
        },
        {
            id: 2,
            file: "authController.js",
            language: "JavaScript",
            date: "09 Jul 2026",
            issues: 3,
            status: "Completed"
        },
        {
            id: 3,
            file: "Dashboard.jsx",
            language: "JavaScript",
            date: "08 Jul 2026",
            issues: 5,
            status: "Completed"
        },
        {
            id: 4,
            file: "App.py",
            language: "Python",
            date: "05 Jul 2026",
            issues: 0,
            status: "Completed"
        },
        {
            id: 5,
            file: "Database.java",
            language: "Java",
            date: "01 Jul 2026",
            issues: 12,
            status: "Completed"
        }
    ];
};
