// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Unauthorized!' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(403).json({ error: 'Invalid or expired token!' });
//   }
// };

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) return res.status(401).json({ error: 'Unauthorized access!' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in your environment variables
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token!' });
  }
};
