import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import "../styles/Dashboard.css"; // Ensure styles are imported at layout level

const DashboardLayout = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
