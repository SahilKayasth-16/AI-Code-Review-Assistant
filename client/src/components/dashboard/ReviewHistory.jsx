import "./ReviewHistory.css";
import { FaBug, FaCheckCircle, FaClock } from "react-icons/fa";

const reivews = [
     {
        id: 1,
        file: "server.js",
        date: "10 Jul 2026",
        issues: 8,
        status: "Completed"
    },
    {
        id: 2,
        file: "authController.js",
        date: "09 Jul 2026",
        issues: 3,
        status: "Completed"
    },
    {
        id: 3,
        file: "Dashboard.jsx",
        date: "08 Jul 2026",
        issues: 5,
        status: "Completed"
    }
];

const ReviewHistory = () => {
    return (
        <section className="review-history">
            <div className="review-header">
                <h2>Recent Reviews</h2>
                <button>View All</button>
            </div>

            <div className="review-list">
                {reivews.map((review) => (
                    <div key={review.id} className="review-card">
                        <div className="review-left">
                            <div className="review icon">
                                <FaCheckCircle />
                            </div>

                            <div>
                                <h3>{review.file}</h3>
                                <p><FaClock />{review.date}</p>
                            </div>
                        </div>

                        <div className="review-right">
                            <span className="issue-badge">
                                <FaBug />{review.issues} Issues
                            </span>

                            <span className="status">
                                {review.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ReviewHistory;