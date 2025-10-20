import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'секретный_код';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
    
  } catch (error) {

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Токен истек' });
    }
    return res.status(403).json({ message: 'Недействительный токен' });
  }
};
