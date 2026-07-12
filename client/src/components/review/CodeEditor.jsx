import React from "react";
import "./CodeEditor.css";

const CodeEditor = ({ code, onChange, language, disabled, placeholder = "Paste your code here..." }) => {
    const getFileTitle = () => {
        switch (language) {
            case "htmlcss":
                return "index.html";
            case "javascript":
                return "app.js";
            case "python":
                return "main.py";
            default:
                return "code.txt";
        }
    };

    return (
        <div className={`code-editor-container ${disabled ? "disabled" : ""}`}>
            <div className="editor-header">
                <div className="editor-dots">
                    <span className="dot dot-red"></span>
                    <span className="dot dot-yellow"></span>
                    <span className="dot dot-green"></span>
                </div>
                <span className="editor-title">{getFileTitle()}</span>
            </div>
            
            <div className="editor-body">
                <textarea
                    value={code}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="editor-textarea"
                    spellCheck="false"
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

export default CodeEditor;
