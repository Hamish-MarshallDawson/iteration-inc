
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"
import '../css/login-page.css';


function Login() {

    //these are state variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();


    const handleLogin = (e) => {
        e.preventDefault();

        if (email === "123@bombaclat.com" && password === "123456") {
            alert("Login successful");
            navigate('/authentication');
        } else {
            alert("Login failed");
        }
        
    }


    return (
        <div className="login">
            <h1>Login</h1>

            <form onSubmit={handleLogin}>
                <div className="input">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                
                <div className="input">
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required   
                    />
                </div>

                <button type="submit" className="submit-button">
                    Login
                </button>
             
            </form>

            <div className="helper-text">
                <p>
                    <Link to="/passwordReset">Forgot Password?</Link>
                </p>
                <p>
                     Don't have an account? <Link to="/sign-up">Sign Up</Link>
                </p>
            </div>
         
        </div>
    );
}

export default Login;
