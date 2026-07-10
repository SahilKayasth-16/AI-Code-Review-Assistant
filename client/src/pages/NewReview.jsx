import React, { useState } from "react";
import LanguageSelector from "../components/review/LanguageSelector";
import CodeEditor from "../components/review/CodeEditor";
import ReviewResult from "../components/review/ReviewResult";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { submitCodeReview } from "../services/reviewService";
import { FaUpload, FaPlay } from "react-icons/fa";
import "../styles/NewReview.css";

const NewReview = () => {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleReview = async () => {
        if (!code.trim()) {
            setError("Please paste some code to review.");
            return;
        }
        setError("");
        setResult(null);
        setLoading(true);

        try {
            const data = await submitCodeReview(code, language);
            setResult(data);
        } catch (err) {
            setError(err.message || "An error occurred during review.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(result, null, 2));
        alert("Review results copied to clipboard!");
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(result, null, 2)], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "ai-review-result.json";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="new-review-page">
            <div className="new-review-card">
                <h2>Analyze Your Code</h2>
                <p className="page-desc">Select your target language and paste your source code below to run a comprehensive AI review scan.</p>
                
                <div className="selector-row">
                    <LanguageSelector selected={language} onChange={setLanguage} />
                    <div className="upload-container">
                        <label className="upload-label">Upload File</label>
                        <button className="upload-btn-coming-soon" disabled>
                            <FaUpload />
                            <span>Upload (Coming Soon)</span>
                        </button>
                    </div>
                </div>

                <CodeEditor code={code} onChange={setCode} />

                {error && <div className="error-message">{error}</div>}

                <div className="action-row">
                    <Button 
                        variant="primary" 
                        onClick={handleReview} 
                        loading={loading}
                        icon={<FaPlay />}
                    >
                        Review Code
                    </Button>
                </div>
            </div>

            {loading && (
                <div className="loader-card">
                    <Loader text="AI Assistant is reviewing code files..." />
                </div>
            )}

            {result && !loading && (
                <ReviewResult 
                    result={result} 
                    onCopy={handleCopy} 
                    onDownload={handleDownload} 
                />
            )}
        </div>
    );
};

export default NewReview;
