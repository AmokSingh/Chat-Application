import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    console.log("isAuth - cookies:", req.cookies);

    let token = req.cookies.token;
    if (!token) {
      console.log("No token found");
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify token
    let verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified:", verifyToken);

    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    // Send more specific error messages
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(500).json({ message: "Server error Authentication" });
  }
};

export default isAuth;
