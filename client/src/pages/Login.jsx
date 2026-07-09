import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext"
import "../styles/Login.css";

const Login = () => {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await loginUser({
                email, 
                password,
            });

           login(response.user, response.token);
           navigate("/dashboard")
        } catch(error) {
            console.error(
                error.response?.data?.message || "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }
    return(
        <div className="login-container">
            <div className="login-card">
                <h1>AI Code Review Assistant</h1>
                <p>Welcome Back ! Login to continue</p>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit">{ loading ? "Logging in" : "Login" }</button>
                </form>

                <p className="register-link">Don't have an account ?{" "} <Link to={"/register"}>Register here</Link> </p>
            </div>
        </div>
    );
};

export default Login;