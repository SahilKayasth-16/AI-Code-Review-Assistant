// Service layer for communicating with the AI Review Assistant Backend APIs

export const submitCodeReview = async (code, language) => {
    const token = localStorage.getItem("token");
    
    if (!code.trim()) {
        throw new Error("Code cannot be empty");
    }

    // Map lowercase frontend select value to exact casing backend validation expects
    const languageMapping = {
        "htmlcss": "HTML/CSS",
        "javascript": "JavaScript",
        "python": "Python"
    };
    const mappedLanguage = languageMapping[language] || language;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ code, language: mappedLanguage })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to submit code review");
    }

    return data; // Returns { success: true, review: { _id, ... } }
};

export const fetchReviewHistory = async () => {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch review history");
    }

    // Map backend Mongo objects to format expected by History/ReviewCard components
    return (data.reviews || []).map((review) => {
        const fileExt = review.language === "Python" ? "py" : review.language === "HTML/CSS" ? "html" : "js";
        const shortId = review._id.slice(-6);
        return {
            id: review._id,
            file: `file_${shortId}.${fileExt}`,
            language: review.language,
            date: new Date(review.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric"
            }),
            issues: (review.analysis || []).length,
            status: review.status || "Completed"
        };
    });
};

export const getReviewById = async (id) => {
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch review detail");
    }

    return data; // Returns { success: true, review: { ... } }
};
