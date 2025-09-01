import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
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

export function generateRefreshToken(userId) {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  const payload = { id: userId, type: 'refresh' };
  const refreshToken = jwt.sign(payload, secret, { expiresIn });
  return refreshToken;
}

export function verifyRefreshToken(refreshToken) {
  return new Promise((resolve, reject) => {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    jwt.verify(refreshToken, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

export function generateTokenPair(userId) {
  const accessToken = generateToken(userId);
  const refreshToken = generateRefreshToken(userId);
  return { accessToken, refreshToken };
}
