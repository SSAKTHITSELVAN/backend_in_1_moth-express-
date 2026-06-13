import {registerUser, loginUser, getUserDetails} from '../services/authService.js';

async function register(req, res) {
  try{
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
}

async function login(req, res) {
  try {
    const user = await loginUser(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getUserInfo(req, res) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const user = await getUserDetails(token);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { register, login, getUserInfo };