import React from "react";
import "./ReviewCard.css";
import { FaBug, FaClock, FaTrash, FaExternalLinkAlt, FaCode } from "react-icons/fa";

const ReviewCard = ({ review, onOpen, onDelete }) => {
    const { id, file, language, date, issues, status } = review;

    return (
        <div className="review-card-item">
            <div className="card-top">
                <div className="file-info">
                    <div className="file-icon-wrapper">
                        <FaCode className="file-icon" />
                    </div>
                    <div className="file-text">
                        <h3>{file}</h3>
                        <span className="lang-badge">{language}</span>
                    </div>
                </div>
                <span className={`status-badge ${status.toLowerCase()}`}>
                    {status}
                </span>
            </div>

            <div className="card-middle">
                <div className="meta-item">
                    <FaClock className="meta-icon" />
                    <span>{date}</span>
                </div>
                <div className="meta-item">
                    <FaBug className="meta-icon bug-icon" />
                    <span>{issues} Issues</span>
                </div>
            </div>

            <div className="card-actions">
                <button className="card-action-btn open-btn" onClick={() => onOpen(id)}>
                    <FaExternalLinkAlt />
                    <span>Open</span>
                </button>
                <button className="card-action-btn delete-btn" onClick={() => onDelete(id)}>
                    <FaTrash />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
};

export default ReviewCard;
