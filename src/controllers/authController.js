import registerUser from '../services/authService.js';

async function register(req, res) {
  try{
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
}

export default register;