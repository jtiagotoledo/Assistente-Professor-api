const jwt = require('jsonwebtoken');

function generateAccessToken(professor) {
  return jwt.sign(
    { id: professor.id, email: professor.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

function generateRefreshToken(professor) {
  return jwt.sign(
    { id: professor.id, email: professor.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
}

module.exports = {
  generateAccessToken,
  generateRefreshToken
};