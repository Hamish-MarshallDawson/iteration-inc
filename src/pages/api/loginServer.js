export default function handler(req, res) {

    if (req.method === 'POST') {

      const { email, password } = req.body;
      const usersDatabase = [
        { email: 'donpollo@bombaclat.com', password: 'abc123' },
        { email: 'vas@nein.com', password: 'mano' }
      ];
      const user = usersDatabase.find((u) => u.email === email && u.password === password);

    if (user) {
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

  } else {

    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });

    
  }
}