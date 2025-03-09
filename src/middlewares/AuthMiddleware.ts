import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv-safe";
dotenv.config();

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

// Token middleware
const verifyToken = (
  req: Request, 
  res:Response, 
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(401).json({ message: "No Authorization Header" });
      return
    }

    // Split the header and take the last token (in case of multiple)
    const tokenParts = authHeader.split(",");
    const lastTokenPart = tokenParts[tokenParts.length - 1].trim();
    const token = lastTokenPart.replace(/^Bearer\s+/i, '');

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded === "string") {
      res.status(403).json({ message: "Invalid token format" });
      return
    }

    req.user = decoded;

    next();
  } catch (error: any) {
    console.error("Token Verification Error:", error.message);
    res.status(403).json({
      message: "Token Verification Failed",
      errorType: error.name,
      errorDetails: error.message,
    });
    return
  }
};

export default verifyToken;