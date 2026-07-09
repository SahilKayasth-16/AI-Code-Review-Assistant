import "../styles/Login.css";

const Login = () => {
    return(
        <div className="login-container">
            <div className="login-card">
                <h1>AI Code Review Assistant</h1>
                <p>Welcome Back ! Login to continue</p>

                <form>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" placeholder="Enter your email" />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" />
                    </div>
                    <button>Login</button>
                </form>

                <p className="register-link">Don't have an account ? <span>Register here</span></p>
            </div>
        </div>
    );
};

export default Login;