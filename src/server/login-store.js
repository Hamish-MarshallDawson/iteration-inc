const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let usersDatabase = [  // Temporary array to act as a database
    { email: 'donpollo@bombaclat.com', password: 'abc123' },
    { email: 'vas@nein.com', password: 'mano' }
  ];


// Route to store user data
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = usersDatabase.find((u) => u.email === email && u.password === password);

    if (user) {
        return res.status(200).json({ message: 'Login successful' });
    } else {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

     
});

app.listen(5000, () => {
    console.log('Server running at http://localhost:5000');
});