const express = require('express');         // Import express to create a server
const cors = require('cors');               // Import cors to allow requests

const app = express();                      // Create an express application
app.use(express.json());                    // Middleware to parse JSON bodies
app.use(cors());                            // Middleware to allow cross-origin requests


// This is just a temporary array acting as a database for user login information
let usersDatabase = [  
    { email: 'donpollo@bombaclat.com', password: 'abc123' },
    { email: 'vas@nein.com', password: 'mano' }
  ];


// Route to handle login requests from the front-end
app.post('/api/login', (req, res) => {
    // Extract email and password from the request body
    const { email, password } = req.body;

     // Find the user with matching email and password in the temporary database array
    const user = usersDatabase.find((u) => u.email === email && u.password === password);

    if (user) {
        // If it exists, return a success message
        return res.status(200).json({ message: 'Login successful' });
    } else {
        // If it doesn't exist, return an error message
        return res.status(401).json({ message: 'Invalid email or password' });
    }

     
});

// Start the server on port 5000 to listen for requests from react front-end
app.listen(5000, () => {
    console.log('Server running at http://localhost:5000');
});