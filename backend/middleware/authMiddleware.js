import cookie from 'cookie';
import { verifyToken } from '../utils/jwtToken.js';

const auth = (req, res, next) => {
  if (!req.headers.cookie) return res.status(401).json({ message: 'Unauthorized' });

  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const decoded = verifyToken(token); // should return { id, role, ... }

  if (!decoded) return res.status(401).json({ message: 'Unauthorized' });

  req.user = decoded;
  next();
};
export { auth };