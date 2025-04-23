const port = process.env.PORT || 8000;

export const config = {
  port,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
};
