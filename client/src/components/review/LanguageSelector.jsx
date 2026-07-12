import React from "react";
import "./LanguageSelector.css";

const languages = [
    { value: "htmlcss", label: "HTML/CSS" },
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
];

const LanguageSelector = ({ selected, onChange, disabled }) => {
    return (
        <div className="language-selector-wrapper">
            <label className="selector-label">Programming Language</label>
            <div className={`custom-select-container ${disabled ? "disabled" : ""}`}>
                <select 
                    value={selected} 
                    onChange={(e) => onChange(e.target.value)}
                    className="language-select"
                    disabled={disabled}
                >
                    <option value="">Select Language</option>
                    {languages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default LanguageSelector;
