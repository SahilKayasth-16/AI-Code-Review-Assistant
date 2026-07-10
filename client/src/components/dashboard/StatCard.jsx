import "./StatCard.css";

const StatCard = ({ title, value, icon, color }) => {
    <div className="stat-card">
        <div className="stat-icon" style={{ color }}>{icon}</div>

        <div className="stat-content">
            <p>{title}</p>
            <h2>{value}</h2>
        </div>
    </div>
};

export default StatCard;