import { verifyToken } from '../utils/jwt.js';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  } try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token." });
  }
}


function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied. You do not have permission to perform this action." });
    }
    next();
  };
}


export { authMiddleware, authorizeRoles };