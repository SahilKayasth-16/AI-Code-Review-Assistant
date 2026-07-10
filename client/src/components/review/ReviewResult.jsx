import React from "react";
import "./ReviewResult.css";
import { FaBug, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaCopy, FaDownload } from "react-icons/fa";
import Button from "../common/Button";

const ReviewResult = ({ result, onCopy, onDownload }) => {
    if (!result) return null;

    const { summary, issues = [] } = result;

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case "error":
            case "bug":
                return <FaBug className="sev-icon sev-bug" />;
            case "warning":
                return <FaExclamationTriangle className="sev-icon sev-warning" />;
            default:
                return <FaInfoCircle className="sev-icon sev-suggestion" />;
        }
    };

    return (
        <div className="review-result-container">
            <header className="result-header">
                <h3>Analysis Results</h3>
                <div className="result-actions">
                    <Button 
                        variant="secondary" 
                        icon={<FaCopy />} 
                        onClick={onCopy}
                        className="action-btn"
                    >
                        Copy
                    </Button>
                    <Button 
                        variant="secondary" 
                        icon={<FaDownload />} 
                        onClick={onDownload}
                        className="action-btn"
                    >
                        Download
                    </Button>
                </div>
            </header>

            <div className="result-summary-grid">
                <div className="summary-card">
                    <span className="summary-label">Score</span>
                    <span className="summary-value score-val">{summary.score}/100</span>
                </div>
                <div className="summary-card">
                    <span className="summary-label">Bugs</span>
                    <span className="summary-value bug-val">{summary.bugs}</span>
                </div>
                <div className="summary-card">
                    <span className="summary-label">Warnings</span>
                    <span className="summary-value warning-val">{summary.warnings}</span>
                </div>
                <div className="summary-card">
                    <span className="summary-label">Optimizations</span>
                    <span className="summary-value suggestion-val">{summary.suggestions}</span>
                </div>
            </div>

            <div className="findings-list">
                <h4>Detailed Findings</h4>
                {issues.length === 0 ? (
                    <div className="no-issues-card">
                        <FaCheckCircle className="check-clean" />
                        <p>No issues found! Your code looks clean and optimized.</p>
                    </div>
                ) : (
                    issues.map((issue, index) => (
                        <div key={index} className={`finding-card ${issue.severity}`}>
                            <div className="finding-title-row">
                                <div className="finding-title-left">
                                    {getSeverityIcon(issue.severity)}
                                    <h5>Line {issue.line}: {issue.title}</h5>
                                </div>
                                <span className={`finding-badge badge-${issue.severity}`}>
                                    {issue.severity.toUpperCase()}
                                </span>
                            </div>
                            <p className="finding-description">{issue.description}</p>
                            {issue.suggestion && (
                                <div className="finding-suggestion">
                                    <strong>Recommendation:</strong>
                                    <code>{issue.suggestion}</code>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewResult;
