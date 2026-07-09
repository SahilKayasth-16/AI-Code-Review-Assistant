import { useState } from "react";
import { registerUser } from "../services/authService";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await registerUser({
                name,
                email,
                password
            });

            console.log(response)
        } catch(error) {
            console.error(
                error.response?.data?.message || "Something Went Wrong." 
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>AI Code Review Assistant</h1>
                <p>Welcome User ! Register first.</p>

                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <label>Name</label>
                        <input type="text" placeholder="Enter your name" value={name} onChange={(e) => {setName(e.target.value)}} />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
                    </div>
                    <button type="submit">{loading ? "Creating Account" : "Register" }</button>
                </form>

                <p className="login-link">Already Registered ? <span>Login here</span></p>
            </div>
        </div>
    );
};

export default Register;