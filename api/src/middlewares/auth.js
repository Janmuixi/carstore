import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  next(); // TODO: remove this line when implementing authentication
  return;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

export function generateToken(userId) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
  const payload = { id: userId };
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
}
