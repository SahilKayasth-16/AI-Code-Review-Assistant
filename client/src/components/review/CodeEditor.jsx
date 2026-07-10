import React from "react";
import "./CodeEditor.css";

const CodeEditor = ({ code, onChange, placeholder = "Paste your code here..." }) => {
    return (
        <div className="code-editor-container">
            <div className="editor-header">
                <div className="editor-dots">
                    <span className="dot dot-red"></span>
                    <span className="dot dot-yellow"></span>
                    <span className="dot dot-green"></span>
                </div>
                <span className="editor-title">main.js</span>
            </div>
            
            <div className="editor-body">
                <textarea
                    value={code}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="editor-textarea"
                    spellCheck="false"
                />
            </div>
        </div>
    );
};

export default CodeEditor;
