import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitCodeReview } from "../services/reviewService";
import LanguageSelector from "../components/review/LanguageSelector";
import CodeEditor from "../components/review/CodeEditor";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { FaPlay, FaCloudUploadAlt } from "react-icons/fa";
import "../styles/NewReview.css";

const NewReview = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [inputMethod, setInputMethod] = useState("paste"); // "paste" or "upload"
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFileUpload = (file) => {
        if (!file) return;

        const allowedExtensions = ["js", "jsx", "ts", "tsx", "py", "html", "css", "json", "txt"];
        const ext = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            setError(`Invalid file type. Allowed files are: .${allowedExtensions.join(', .')}`);
            return;
        }

        if (file.size === 0) {
            setError("Uploaded file is empty.");
            return;
        }

        const reader = new FileReader();
        setLoading(true);
        setError("");

        reader.onload = (e) => {
            const content = e.target.result;
            if (!content || content.trim() === "") {
                setError("Uploaded file is empty.");
                setLoading(false);
                return;
            }
            setCode(content);
            setUploadedFileName(file.name);
            setLoading(false);
        };

        reader.onerror = () => {
            setError("Failed to read file.");
            setLoading(false);
        };

        reader.readAsText(file);
    };

    const handleRemoveFile = () => {
        setUploadedFileName(null);
        setCode("");
        setError("");
    };

    const handleReview = async (e) => {
        if (e) e.preventDefault();

        // 1. Validation
        if (!language) {
            setError("Please select a programming language.");
            return;
        }
        if (inputMethod === "upload" && !uploadedFileName) {
            setError("Please upload a code file before submitting.");
            return;
        }
        if (!code.trim()) {
            setError(inputMethod === "upload" ? "Uploaded file is empty." : "Please enter your code.");
            return;
        }

        // 2. Clear errors and set loading state
        setError("");
        setLoading(true);

        try {
            const data = await submitCodeReview(code, language, inputMethod === "upload" ? uploadedFileName : null);
            if (data.success && data.review && data.review._id) {
                navigate(`/review/${data.review._id}`);
            } else {
                setError("Failed to generate review. Response was missing details.");
            }
        } catch (err) {
            setError(err.message || "An error occurred during the code review.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new-review-page">
            <div className="new-review-card">
                <h2>Code Review</h2>
                <p className="page-desc">Submit your code for automated AI feedback and reviews.</p>
                
                <form onSubmit={handleReview}>
                    <div className="form-group">
                        <LanguageSelector 
                            selected={language} 
                            onChange={setLanguage} 
                            disabled={loading} 
                        />
                    </div>

                    <div className="separator-line"></div>

                    <div className="input-method-section">
                        <label className="method-label">Choose Input Method</label>
                        <div className="input-method-selector">
                            <button
                                type="button"
                                className={`method-btn ${inputMethod === "paste" ? "active" : ""}`}
                                onClick={() => setInputMethod("paste")}
                                disabled={loading}
                            >
                                Paste Code
                            </button>
                            <button
                                type="button"
                                className={`method-btn ${inputMethod === "upload" ? "active" : ""}`}
                                onClick={() => setInputMethod("upload")}
                                disabled={loading}
                            >
                                Upload File
                            </button>
                        </div>
                    </div>

                    {inputMethod === "upload" && (
                        <div 
                            className={`upload-zone ${dragOver ? "drag-over" : ""} ${uploadedFileName ? "has-file" : ""}`}
                            onDragOver={(e) => { e.preventDefault(); if (!loading) setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => { e.preventDefault(); setDragOver(false); if (!loading) handleFileUpload(e.dataTransfer.files[0]); }}
                        >
                            {!uploadedFileName ? (
                                <label className="upload-label">
                                    <FaCloudUploadAlt className="upload-icon" />
                                    <span className="upload-title">Drag & Drop file here or click to browse</span>
                                    <span className="upload-hint">Supported file types: .js, .jsx, .ts, .tsx, .py, .html, .css, .json, .txt</span>
                                    <input 
                                        type="file" 
                                        style={{ display: "none" }} 
                                        onChange={(e) => handleFileUpload(e.target.files[0])}
                                        accept=".js,.jsx,.ts,.tsx,.py,.html,.css,.json,.txt"
                                        disabled={loading}
                                    />
                                </label>
                            ) : (
                                <div className="uploaded-file-details">
                                    <span className="file-info-label">Selected File:</span>
                                    <span className="file-name">{uploadedFileName}</span>
                                    <button 
                                        type="button" 
                                        className="remove-file-btn" 
                                        onClick={handleRemoveFile}
                                        disabled={loading}
                                    >
                                        Remove File
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {(inputMethod === "paste" || uploadedFileName) && (
                        <div className="form-group">
                            <label className="editor-label">
                                {inputMethod === "upload" ? "Uploaded File Content" : "Source Code"}
                            </label>
                            <CodeEditor 
                                code={code} 
                                onChange={setCode} 
                                language={language}
                                disabled={loading} 
                            />
                        </div>
                    )}

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
