import React from "react";
import "./Button.css";

const Button = ({ 
    children, 
    onClick, 
    type = "button", 
    variant = "primary", // primary, secondary, danger, outline
    disabled = false, 
    loading = false, 
    icon = null,
    className = "" 
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`btn btn-${variant} ${loading ? "loading" : ""} ${className}`}
        >
            {loading ? (
                <span className="btn-spinner"></span>
            ) : (
                <>
                    {icon && <span className="btn-icon">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
