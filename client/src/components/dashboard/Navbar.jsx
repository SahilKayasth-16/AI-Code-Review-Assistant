import "./Navbar.css";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const { user } = useAuth();

    return(
        <header className="dashboard-navbar">
            <div className="navbar-left">
                <h1>Dashbaord</h1>
                <p>Welcome back, <strong>{user.name || "Developer"}</strong></p>
            </div>

            <div className="navbar-right">
                <button className="notification-btn">
                    <FaBell />
                </button>

                <div className="profile-card">
                    <FaUserCircle className="profile-icon" />
                    <div>
                        <h4>{user.name || "Developer"}</h4>
                        <span>{user.email || "developer@test.com"}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;