import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReviewCard from "../components/review/ReviewCard";
import Loader from "../components/common/Loader";
import { fetchReviewHistory } from "../services/reviewService";
import { FaSearch, FaFilter, FaCalendarAlt } from "react-icons/fa";
import "../styles/History.css";

const History = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await fetchReviewHistory();
                setReviews(data);
            } catch (err) {
                console.error("Failed to load review history", err);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    const handleOpen = (id) => {
        navigate(`/review/${id}`);
    };

    const handleDelete = (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this scan history?");
        if (confirmed) {
            setReviews(reviews.filter((r) => r.id !== id));
        }
    };

    const filteredReviews = reviews
        .filter((review) => {
            const matchesSearch = review.file.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLanguage = selectedLanguage === "all" || review.language.toLowerCase() === selectedLanguage.toLowerCase();
            return matchesSearch && matchesLanguage;
        })
        .sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.date) - new Date(a.date);
            } else if (sortBy === "oldest") {
                return new Date(a.date) - new Date(b.date);
            } else if (sortBy === "issues") {
                return b.issues - a.issues;
            }
            return 0;
        });

    return (
        <div className="history-page">
            <div className="filters-card">
                <div className="search-group">
                    <FaSearch className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search by file name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-group">
                    <div className="select-wrapper">
                        <FaFilter className="select-icon" />
                        <select 
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Languages</option>
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="html/css">HTML/CSS</option>
                        </select>
                    </div>

                    <div className="select-wrapper">
                        <FaCalendarAlt className="select-icon" />
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="issues">Most Issues</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loading-container-card">
                    <Loader text="Retrieving scan history logs..." />
                </div>
            ) : (
                <>
                    {filteredReviews.length === 0 ? (
                        <div className="empty-history-card">
                            <p>No review histories found matching the filter criteria.</p>
                        </div>
                    ) : (
                        <div className="reviews-grid">
                            {filteredReviews.map((review) => (
                                <ReviewCard 
                                    key={review.id} 
                                    review={review} 
                                    onOpen={handleOpen} 
                                    onDelete={handleDelete} 
                                />
                            ))}
                        </div>
                    )}

                    <div className="pagination-wrapper">
                        <button className="page-nav-btn" disabled>Prev</button>
                        <div className="page-numbers">
                            <span className="page-num active">1</span>
                            <span className="page-num">2</span>
                            <span className="page-num">3</span>
                        </div>
                        <button className="page-nav-btn" disabled>Next</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default History;
