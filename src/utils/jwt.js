import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY || 'your_secret_key';

function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

function verifyToken(token, secret = secretKey) {
  try {
    console.log('Verifying token:', token);
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error('Invalid token');
  }
}

export { generateToken, verifyToken, generateRefreshToken };