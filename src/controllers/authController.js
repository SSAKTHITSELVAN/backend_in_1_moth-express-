import { registerUser } from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};