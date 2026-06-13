import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY || 'your_secret_key';

function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    console.log('Verifying token:', token);
    return jwt.verify(token, secretKey);
  } catch (err) {
    throw new Error('Invalid token');
  }
}

export { generateToken, verifyToken };