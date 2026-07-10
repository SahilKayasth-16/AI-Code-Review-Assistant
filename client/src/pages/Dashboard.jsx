import Navbar from "../components/dashboard/Navbar";
import Sidebar from "../components/dashboard/Sidebar";
import ReviewHistory from "../components/dashboard/ReviewHistory";

import "../styles/Dashboard.css";

const Dashbaord = () => {
    return(
        <div className="dashboard">
            <Sidebar />
            <div className="dashboard-content">
                <Navbar />
                <div className="dashboard-body">
                    <ReviewHistory />
                </div>
            </div>
        </div>
    );
};

export default Dashbaord;