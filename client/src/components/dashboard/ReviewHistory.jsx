import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewHistory.css";
import { FaCheckCircle, FaClock, FaExclamationTriangle, FaSearch, FaTrash } from "react-icons/fa";
import Loader from "../common/Loader";
import { deleteReview } from "../../services/reviewService";

const ReviewHistory = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 4000);
    };

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem("token");
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
            
            const response = await fetch(`${apiUrl}/api/reviews`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch reviews: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            if (data.success && Array.isArray(data.reviews)) {
                setReviews(data.reviews);
                setError(null);
            } else {
                throw new Error("Invalid review history response");
            }
        } catch (err) {
            console.error("Error fetching review history:", err);
            setError(err.message || "Failed to load review history.");
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setLoading(true);
        setError(null);
        fetchReviews();
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent card navigation
        
        const confirmed = window.confirm("Are you sure you want to delete this review?");
        if (!confirmed) return;

        try {
            setDeletingId(id);
            const data = await deleteReview(id);
            // Immediately remove from React local state
            setReviews((prevReviews) => prevReviews.filter((r) => r.id !== id));
            showNotification(data.message || "Review deleted successfully.", "success");
        } catch (err) {
            console.error("Error deleting review:", err);
            showNotification(err.message || "Failed to delete review. Please try again.", "error");
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchReviews();
    }, []);

    const getScoreClass = (score) => {
        if (typeof score !== "number") return "";
        if (score >= 80) return "high";
        if (score >= 50) return "medium";
        return "low";
    };

    const filteredReviews = reviews.filter((review) => {
        const language = (review.language || "").toLowerCase();
        const status = (review.status || "").toLowerCase();
        const summary = (review.reviewResult?.summary ?? review.aiReview?.summary ?? "").toLowerCase();
        const term = searchTerm.trim().toLowerCase();
        return language.includes(term) || summary.includes(term) || status.includes(term);
    });

    return (
        <section className="review-history">
            {notification && (
                <div className={`local-notification ${notification.type}`}>
                    <p>{notification.message}</p>
                </div>
            )}
            
            <div className="review-header">
                <h2>Recent Reviews</h2>
                <button onClick={() => navigate("/history")}>View All</button>
            </div>

            {loading ? (
                <div className="review-loading">
                    <Loader text="Loading review history..." />
                </div>
            ) : error ? (
                <div className="review-error">
                    <FaExclamationTriangle className="error-icon" />
                    <p className="error-message">{error}</p>
                    <button className="retry-btn" onClick={handleRetry}>Retry</button>
                </div>
            ) : reviews.length === 0 ? (
                <div className="review-empty">
                    <p>No reviews found.</p>
                </div>
            ) : (
                <>
                    <div className="search-bar-container">
                        <FaSearch className="search-bar-icon" />
                        <input
                            type="text"
                            placeholder="Search by language, summary, or status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-bar-input"
                        />
                    </div>

                    {filteredReviews.length === 0 ? (
                        <div className="review-empty">
                            <p>No matching reviews found.</p>
                        </div>
                    ) : (
                        <div className="review-list">
                            {filteredReviews.map((review) => {
                                const score = review.reviewResult?.overallScore ?? review.aiReview?.overallScore ?? "N/A";
                                const summary = review.reviewResult?.summary ?? review.aiReview?.summary ?? "No summary available.";
                                const formattedDate = new Date(review.createdAt).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                });

                                return (
                                    <div 
                                        key={review.id} 
                                        className="review-card" 
                                        onClick={() => navigate(`/review/${review.id}`)}
                                    >
                                        <div className="review-left">
                                            <div className="review-icon">
                                                <FaCheckCircle />
                                            </div>

                                            <div className="review-details">
                                                <div className="review-meta-header">
                                                    <h3>{review.language === "HTML_CSS" ? "HTML/CSS" : review.language}</h3>
                                                    <span className={`score-badge ${getScoreClass(score)}`}>
                                                        Score: {score}
                                                    </span>
                                                </div>
                                                {review.fileName && (
                                                    <p className="review-file-name" style={{ fontSize: "13px", fontWeight: "600", color: "#4f8cff", margin: "4px 0" }}>
                                                        {review.fileName}
                                                    </p>
                                                )}
                                                <p className="review-summary-text">{summary}</p>
                                                <p className="review-date"><FaClock /> {formattedDate}</p>
                                            </div>
                                        </div>

                                        <div className="review-right">
                                            <span className={`status ${(review.status || "Completed").toLowerCase()}`}>
                                                {review.status || "Completed"}
                                            </span>
                                            <button 
                                                className="delete-review-btn"
                                                onClick={(e) => handleDelete(e, review.id)}
                                                disabled={deletingId === review.id}
                                                title="Delete Review"
                                            >
                                                <FaTrash />
                                                <span>{deletingId === review.id ? "Deleting..." : "Delete"}</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default ReviewHistory;
