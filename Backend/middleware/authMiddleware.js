import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // token get from header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token, access denied ❌" });
    }

    // Bearer token split
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token ❌" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // user info attach
    req.user = decoded;

    next(); // go to next route
  } catch (error) {
    res.status(401).json({ message: "Token is not valid ❌" });
  }
};

export default authMiddleware;