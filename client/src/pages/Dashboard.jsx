import ReviewHistory from "../components/dashboard/ReviewHistory";
import StatCard from "../components/dashboard/StatCard";
import { FaBug, FaClipboardCheck, FaRobot, FaCode } from "react-icons/fa";

const Dashboard = () => {
    return (
        <div className="dashboard-page">
            <div className="stats-grid">
                <StatCard title="Total Reviews" value="24" icon={<FaClipboardCheck />} color="#4f8cff" />
                <StatCard title="AI Suggestions" value="182" icon={<FaRobot />} color="#10b981" />
                <StatCard title="Issues Found" value="37" icon={<FaBug />} color="#ef4444" />
                <StatCard title="Files Reviewed" value="14" icon={<FaCode />} color="#f59e0b" />
            </div>
            <ReviewHistory />
        </div>
    );
};

export default Dashboard;