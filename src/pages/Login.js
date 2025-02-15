
import { useState } from 'react';

import '../Login.css';


function Login() {

    //these are state variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (email === "123@bombaclat.com" || password === "123456") {
            alert("Login successful");
        } else {
            alert("Login failed");
        }
    }


    return (
        <div className="login">
            <h1>Login</h1>

            <form onSubmit={handleLogin} className="login-form">
                <div className="input">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email" required 
                        
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

         
        </div>
    );
}

export default Login;
