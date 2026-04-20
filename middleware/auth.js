import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // ✅ Get header safely
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("VerifyToken Error: No Bearer token found in header", authHeader);
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];
    console.log("VerifyToken: Extracted token:", token);

    // ✅ Verify token
    const decoded = jwt.verify(token, "secretkey");
    console.log("VerifyToken: Decoded payload:", decoded);

    // ✅ Attach user to request
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};