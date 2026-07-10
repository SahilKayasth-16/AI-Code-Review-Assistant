import { NavLink } from "react-router-dom";
import { FaCode, FaHome, FaPlusCircle, FaHistory, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
    const { logout } = useAuth();

    return(
        <aside className="sidebar">
            <div>
                <div className="sidebar-logo">
                    <FaCode className="logo-icon"/>
                    <h2>AI Review</h2>
                    <span>Assistant</span>
                </div>

                <nav className="sidebar-menu">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
                        <FaHome />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/new-review" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
                        <FaPlusCircle />
                        <span>New Reivew</span>
                    </NavLink>

                    <NavLink to="/history" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
                        <FaHistory />
                        <span>Review History</span>
                    </NavLink>

                    <NavLink to="/settings" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
                        <FaCog />
                        <span>Settings</span>
                    </NavLink>
                </nav>
            </div>

            <button className="sign-out" onClick={logout}>
                <FaSignInAlt />
                <span>Logout</span>   
            </button>
        </aside>
    );
}

export default Sidebar;