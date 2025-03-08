import { useState, useEffect } from "react";
import axios from "axios";

export default function TestDB() {
    const [response, setResponse] = useState("Checking database connection");

    useEffect(() => {
        const checkDatabase = async () => {
          try {
            alert(response)
            const res = await axios.get(`${window.location.origin}/api/test-db.js`); 
            
            setResponse(res.data.message);
            alert("worked");

          } catch (error) {

            setResponse("Error connecting to database");
            alert("Error connecting to database");

          }
        };
    
        checkDatabase(); 
      }, []);

  return (
    <div className="login-container">
      <h2>Test Database Connection</h2>
      <p >{response}</p>
    </div>
  );
}
