import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface RequestWithUserRole extends Request {
  user?: string;
}

const verifyJWT = (
  req: RequestWithUserRole,
  res: Response,
  next: NextFunction
) => {
  const authHeader = (req.headers.Authorization ||
    req.headers.authorization) as string;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err)
        return res
          .status(401)
          .clearCookie("jwt", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
          })
          .json({ message: "Forbidden" });
      if (
        typeof decoded === "object" &&
        "UserInfo" in decoded &&
        "username" in decoded.UserInfo &&
        decoded.UserInfo.username === "string"
      ) {
        req.user = decoded.UserInfo.username;
      }
      next();
    }
  );
};

export default verifyJWT;
