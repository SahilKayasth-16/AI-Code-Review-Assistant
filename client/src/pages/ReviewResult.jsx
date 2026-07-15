import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReviewById } from "../services/reviewService";
import Loader from "../components/common/Loader";
import { 
    FaArrowLeft, 
    FaBug, 
    FaCode, 
    FaLightbulb, 
    FaBook, 
    FaExclamationTriangle, 
    FaInfoCircle, 
    FaCheckCircle,
    FaRobot,
    FaFileAlt
} from "react-icons/fa";
import "../styles/reviewResult.css";

const ReviewResult = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchReviewDetails = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await getReviewById(id);
                if (data.success && data.review) {
                    setReview(data.review);
                } else {
                    setError("Failed to locate review record.");
                }
            } catch (err) {
                console.error("Error fetching review:", err);
                setError(err.message || "Failed to load code review details from backend.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchReviewDetails();
        }
    }, [id]);

    const getScoreColorClass = (score) => {
        if (score >= 90) return "score-high";
        if (score >= 70) return "score-good";
        if (score >= 50) return "score-medium";
        return "score-low";
    };

    const mapSeverity = (severity) => {
        if (typeof severity === "number") {
            if (severity === 2) return "error";
            if (severity === 1) return "warning";
            return "info";
        }
        return (severity || "info").toLowerCase();
    };

    const getComplexityClass = (text) => {
        let str = "";
        if (typeof text === "string") {
            str = text;
        } else if (text && typeof text === "object") {
            str = text.rating || text.level || text.summary || JSON.stringify(text);
        } else if (text !== undefined && text !== null) {
            str = String(text);
        }
        
        const lower = str.toLowerCase();
        if (lower.includes("high")) return "high";
        if (lower.includes("medium")) return "medium";
        return "low";
    };

    if (loading) {
        return (
            <div className="review-result-page" style={{ justifyContent: "center", alignItems: "center", minHeight: "450px" }}>
                <div className="nm-card" style={{ width: "100%", maxWidth: "500px", padding: "40px", textAlign: "center" }}>
                    <Loader text="Retrieving detailed code analysis logs..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="review-result-page" style={{ justifyContent: "center", alignItems: "center", minHeight: "450px" }}>
                <div className="nm-card" style={{ width: "100%", maxWidth: "500px", padding: "40px", textAlign: "center" }}>
                    <FaExclamationTriangle style={{ fontSize: "48px", color: "#ef4444", marginBottom: "20px" }} />
                    <h2 style={{ color: "#24324a", marginBottom: "10px" }}>Error Loading Review</h2>
                    <p style={{ color: "#6b7280", marginBottom: "25px", fontSize: "14px", lineHeight: 1.5 }}>{error}</p>
                    <button className="back-btn" style={{ margin: "0 auto" }} onClick={() => navigate("/history")}>
                        Back to History
                    </button>
                </div>
            </div>
        );
    }

    if (!review) {
        return (
            <div className="review-result-page" style={{ justifyContent: "center", alignItems: "center", minHeight: "450px" }}>
                <div className="nm-card" style={{ width: "100%", maxWidth: "500px", padding: "40px", textAlign: "center" }}>
                    <FaInfoCircle style={{ fontSize: "48px", color: "#f59e0b", marginBottom: "20px" }} />
                    <h2 style={{ color: "#24324a", marginBottom: "10px" }}>No Review Found</h2>
                    <p style={{ color: "#6b7280", marginBottom: "25px", fontSize: "14px" }}>We couldn't locate the requested code review details.</p>
                    <button className="back-btn" style={{ margin: "0 auto" }} onClick={() => navigate("/history")}>
                        Back to History
                    </button>
                </div>
            </div>
        );
    }

    // Defensive parsing of results
    const aiResult = review.reviewResult || review.aiReview || {};
    const staticAnalysis = Array.isArray(review.analysis) ? review.analysis : [];

    // Map properties with fallbacks
    const overallScore = typeof aiResult.overallScore === "number" ? aiResult.overallScore : (typeof aiResult.score === "number" ? aiResult.score : 80);
    
    // Safely retrieve summaryText
    let summaryText = "No summary overview available.";
    if (typeof aiResult.summary === "string") {
        summaryText = aiResult.summary;
    } else if (aiResult.summary && typeof aiResult.summary === "object") {
        summaryText = aiResult.summary.text || aiResult.summary.description || JSON.stringify(aiResult.summary);
    } else if (aiResult.summary !== undefined && aiResult.summary !== null) {
        summaryText = String(aiResult.summary);
    }

    // Safely retrieve complexityText
    let complexityText = "No complexity analysis details available.";
    if (typeof aiResult.complexity === "string") {
        complexityText = aiResult.complexity;
    } else if (aiResult.complexity && typeof aiResult.complexity === "object") {
        complexityText = aiResult.complexity.summary || aiResult.complexity.description || aiResult.complexity.text || JSON.stringify(aiResult.complexity);
    } else if (aiResult.complexity !== undefined && aiResult.complexity !== null) {
        complexityText = String(aiResult.complexity);
    }

    // Safely retrieve namingText & namingItems
    let namingText = "No naming convention review details available.";
    let namingItems = [];
    
    const rawNaming = aiResult.naming || aiResult.namingReview;
    if (rawNaming) {
        if (typeof rawNaming === "string") {
            const trimmed = rawNaming.trim();
            if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) {
                        namingItems = parsed;
                    } else if (parsed && typeof parsed === "object") {
                        namingItems = [parsed];
                    } else {
                        namingText = rawNaming;
                    }
                } catch (e) {
                    namingText = rawNaming;
                }
            } else {
                namingText = rawNaming;
            }
        } else if (Array.isArray(rawNaming)) {
            namingItems = rawNaming;
        } else if (typeof rawNaming === "object") {
            namingItems = [rawNaming];
        } else {
            namingText = String(rawNaming);
        }
    }

    // Map any parsed items to standard format
    namingItems = namingItems.map(item => {
        if (typeof item === "string") {
            return { title: "Recommendation", severity: "info", description: item };
        }
        return {
            title: item?.title || "Recommendation",
            severity: item?.severity || "info",
            description: item?.description || item?.message || item?.text || ""
        };
    });

    // Safely map lists of issues
    const bugsList = (Array.isArray(aiResult.bugs) ? aiResult.bugs : []).map(bug => {
        if (typeof bug === "string") {
            return { title: "Issue Detected", severity: "warning", description: bug };
        }
        return {
            title: bug?.title || "Issue Detected",
            severity: bug?.severity || "warning",
            description: bug?.description || ""
        };
    });

    const smellsList = (Array.isArray(aiResult.codeSmells) ? aiResult.codeSmells : []).map(smell => {
        if (typeof smell === "string") {
            return { title: "Smell Detected", severity: "low", description: smell };
        }
        return {
            title: smell?.title || "Smell Detected",
            severity: smell?.severity || "low",
            description: smell?.description || ""
        };
    });

    const optimizationsList = (Array.isArray(aiResult.optimization) ? aiResult.optimization : (Array.isArray(aiResult.optimizations) ? aiResult.optimizations : [])).map(opt => {
        if (typeof opt === "string") return opt;
        if (opt && typeof opt === "object") return opt.description || opt.suggestion || opt.text || JSON.stringify(opt);
        return String(opt);
    });

    const documentationsList = (Array.isArray(aiResult.documentation) ? aiResult.documentation : (Array.isArray(aiResult.documentations) ? aiResult.documentations : [])).map(doc => {
        if (typeof doc === "string") return doc;
        if (doc && typeof doc === "object") return doc.description || doc.suggestion || doc.text || JSON.stringify(doc);
        return String(doc);
    });

    const shortId = review._id.slice(-6);
    const fileExt = review.language === "Python" ? "py" : review.language === "HTML/CSS" ? "html" : "js";
    const generatedFileName = `file_${shortId}.${fileExt}`;

    return (
        <div className="review-result-page">
            {/* Header & Back Button */}
            <div className="result-page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <FaFileAlt style={{ color: '#4f8cff' }} />
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#4b5563' }}>
                        {generatedFileName} ({review.language})
                    </span>
                </div>
            </div>

            {/* Score & AI Review Summary Section */}
            <div className="summary-grid">
                {/* Overall Score Card */}
                <div className="nm-card score-card">
                    <div className="score-container">
                        <div>
                            <span className={`score-value ${getScoreColorClass(overallScore)}`}>
                                {overallScore}
                            </span>
                            <span className="score-label" style={{ display: 'block' }}>/ 100</span>
                        </div>
                    </div>
                    <h2>Overall Score</h2>
                    <p className="score-summary-text">{summaryText}</p>
                </div>

                {/* AI Review Section */}
                <div className="nm-card ai-review-content">
                    <div className="ai-review-header">
                        <h2>AI Review Summary</h2>
                    </div>
                    <div className="ai-details-grid">
                        <div className="ai-detail-block">
                            <h4>Overview</h4>
                            <p>{summaryText}</p>
                        </div>
                        <div className="ai-detail-block">
                            <h4>Complexity</h4>
                            <p>
                                <span className={`complexity-badge ${getComplexityClass(complexityText)}`} style={{ marginBottom: '8px' }}>
                                    {getComplexityClass(complexityText)}
                                </span>
                            </p>
                            <p>{complexityText}</p>
                        </div>
                        <div className="ai-detail-block scrollable">
                            <h4>Naming Conventions</h4>
                            {namingItems.length > 0 ? (
                                <div className="naming-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {namingItems.map((item, index) => {
                                        const mappedSev = mapSeverity(item.severity);
                                        return (
                                            <div key={index} className="naming-item" style={{ 
                                                borderBottom: index < namingItems.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', 
                                                paddingBottom: index < namingItems.length - 1 ? '10px' : '0' 
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '8px' }}>
                                                    <strong style={{ fontSize: '13px', color: '#24324a' }}>{item.title}</strong>
                                                    {item.severity && (
                                                        <span className={`badge-severity ${mappedSev}`} style={{ fontSize: '10px', padding: '2px 6px', lineHeight: '1', whiteSpace: 'nowrap' }}>
                                                            {item.severity}
                                                        </span>
                                                    )}
                                                </div>
                                                <p style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.4', margin: 0 }}>{item.description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p>{namingText}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Static Analysis Section */}
            <div className="nm-card static-analysis-section">
                <h2 className="section-title">
                    <FaCode style={{ color: '#4f8cff' }} /> Static Analysis Linter
                </h2>
                {staticAnalysis.length === 0 ? (
                    <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "10px", 
                        padding: "16px", 
                        background: "rgba(16, 185, 129, 0.08)", 
                        borderRadius: "14px", 
                        color: "#10b981", 
                        fontWeight: 600,
                        fontSize: "14px",
                        boxShadow: "inset 2px 2px 5px #bcc2cb, inset -2px -2px 5px #ffffff"
                    }}>
                        <FaCheckCircle style={{ fontSize: "16px" }} /> No static analysis lint issues found. Your code formatting and syntax looks clean!
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="sa-table">
                            <thead>
                                <tr>
                                    <th>Rule ID</th>
                                    <th>Severity</th>
                                    <th>Message</th>
                                    <th>Line / Col</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staticAnalysis.map((item, index) => {
                                    const sevMapped = mapSeverity(item.severity);
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <span className="rule-badge">{item.ruleId || "Unknown"}</span>
                                            </td>
                                            <td>
                                                <span className={`badge-severity ${sevMapped}`}>
                                                    {sevMapped}
                                                </span>
                                            </td>
                                            <td>{item.message}</td>
                                            <td>
                                                <span className="location-badge">
                                                    {item.line}:{item.column}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Bugs and Code Smells Card List */}
            <div className="cards-list-container">
                {/* Bug Detection Section */}
                <div className="nm-card static-analysis-section">
                    <h2 className="section-title">
                        <FaBug style={{ color: '#ef4444' }} /> Bug Detection
                    </h2>
                    <div className="finding-issue-list">
                        {bugsList.length === 0 ? (
                            <div className="nm-card issue-card low" style={{ borderLeftColor: "#10b981", boxShadow: "inset 2px 2px 5px #bcc2cb, inset -2px -2px 5px #ffffff" }}>
                                <div className="issue-card-header">
                                    <h3>No bugs detected</h3>
                                    <span className="badge-severity low">Passed</span>
                                </div>
                                <p className="issue-card-desc" style={{ fontSize: "13px" }}>The AI did not identify any logical execution bugs or critical security issues.</p>
                            </div>
                        ) : (
                            bugsList.map((bug, index) => {
                                const bugSev = mapSeverity(bug.severity);
                                return (
                                    <div key={index} className={`nm-card issue-card ${bugSev}`}>
                                        <div className="issue-card-header">
                                            <h3>{bug.title}</h3>
                                            <span className={`badge-severity ${bugSev}`}>
                                                {bugSev}
                                            </span>
                                        </div>
                                        <p className="issue-card-desc">{bug.description}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Code Smells Section */}
                <div className="nm-card static-analysis-section">
                    <h2 className="section-title">
                        <FaRobot style={{ color: '#f59e0b' }} /> Code Smells
                    </h2>
                    <div className="finding-issue-list">
                        {smellsList.length === 0 ? (
                            <div className="nm-card issue-card low" style={{ borderLeftColor: "#10b981", boxShadow: "inset 2px 2px 5px #bcc2cb, inset -2px -2px 5px #ffffff" }}>
                                <div className="issue-card-header">
                                    <h3>No smells detected</h3>
                                    <span className="badge-severity low">Passed</span>
                                </div>
                                <p className="issue-card-desc" style={{ fontSize: "13px" }}>The AI did not identify any structural or maintainability flaws in this segment.</p>
                            </div>
                        ) : (
                            smellsList.map((smell, index) => {
                                const smellSev = mapSeverity(smell.severity);
                                return (
                                    <div key={index} className={`nm-card issue-card ${smellSev}`}>
                                        <div className="issue-card-header">
                                            <h3>{smell.title}</h3>
                                            <span className={`badge-severity ${smellSev}`}>
                                                {smellSev}
                                            </span>
                                        </div>
                                        <p className="issue-card-desc">{smell.description}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Suggestions Sections */}
            <div className="suggestions-grid">
                {/* Optimization Suggestions Section */}
                <div className="nm-card static-analysis-section">
                    <h2 className="section-title">
                        <FaLightbulb style={{ color: '#10b981' }} /> Optimization Suggestions
                    </h2>
                    {optimizationsList.length === 0 ? (
                        <p style={{ color: "#6b7280", fontSize: "14px" }}>No optimization suggestions available.</p>
                    ) : (
                        <ul className="suggestion-bullet-list opt-list">
                            {optimizationsList.map((opt, index) => (
                                <li key={index}>{opt}</li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Documentation Suggestions Section */}
                <div className="nm-card static-analysis-section">
                    <h2 className="section-title">
                        <FaBook style={{ color: '#8b5cf6' }} /> Documentation Suggestions
                    </h2>
                    {documentationsList.length === 0 ? (
                        <p style={{ color: "#6b7280", fontSize: "14px" }}>No documentation recommendations.</p>
                    ) : (
                        <ul className="suggestion-bullet-list doc-list">
                            {documentationsList.map((doc, index) => (
                                <li key={index}>{doc}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewResult;
