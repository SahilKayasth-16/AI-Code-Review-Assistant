import React, { useState } from "react";
import LanguageSelector from "../components/review/LanguageSelector";
import CodeEditor from "../components/review/CodeEditor";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { FaPlay } from "react-icons/fa";
import "../styles/NewReview.css";

const NewReview = () => {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleReview = (e) => {
        if (e) e.preventDefault();

        // 1. Validation
        if (!language) {
            setError("Please select a programming language.");
            return;
        }
        if (!code.trim()) {
            setError("Please enter your code.");
            return;
        }

        // 2. Clear errors and set loading state
        setError("");
        setLoading(true);

        // 3. Simulate API call
        setTimeout(() => {
            setLoading(false);
        }, 2500);
    };

    return (
        <div className="new-review-page">
            <div className="new-review-card">
                <h2>Code Review</h2>
                <p className="page-desc">Paste your code below for AI analysis.</p>
                
                <form onSubmit={handleReview}>
                    <div className="form-group">
                        <LanguageSelector 
                            selected={language} 
                            onChange={setLanguage} 
                            disabled={loading} 
                        />
                    </div>

                    <div className="form-group">
                        <label className="editor-label">Source Code</label>
                        <CodeEditor 
                            code={code} 
                            onChange={setCode} 
                            language={language}
                            disabled={loading} 
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="action-row">
                        <Button 
                            variant="primary" 
                            type="submit"
                            disabled={loading}
                            className={loading ? "loading" : ""}
                        >
                            {loading ? (
                                <>
                                    <span className="btn-spinner"></span>
                                    <span>Reviewing...</span>
                                </>
                            ) : (
                                <>
                                    <FaPlay className="btn-icon" />
                                    <span>Review Code</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {loading && (
                <div className="loader-card">
                    <Loader text="AI Assistant is reviewing code files..." />
                </div>
            )}
        </div>
    );
};

export default NewReview;
