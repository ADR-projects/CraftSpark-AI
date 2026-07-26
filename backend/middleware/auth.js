const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ error: "No authentication token, authorization denied." });
    
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token format invalid." });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token verification failed, authorization denied." });
  }
};

module.exports = auth;
