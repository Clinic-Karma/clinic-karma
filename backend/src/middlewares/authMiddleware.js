import { verifyAccessToken } from "../utils/token.js";

export function requireAuth(req, res, next) {
  try {
    // Check for token in Authorization header first, then cookies
    let token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      token = req.cookies?.accessToken;
    }
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    // Map lab-assistant to lab-coordinator for backwards compatibility
    const userRole = req.user.role === 'lab-assistant' ? 'lab-coordinator' : req.user.role;
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}