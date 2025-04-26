import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { redis } from "../services/redis";
import { generateAccessToken } from "../utils/generateToken";
import User from "../models/User";

interface CustomRequest extends Request {
  currentRole?: string;
}

// checks user authentication
const checkAuth = (role: string) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    // getting the access token from cookie
    const token = req.cookies.access_token;

    // access and refresh secret
    const accessSecret = process.env.ACCESS_SECRET as Secret;
    const refreshSecret = process.env.REFRESH_SECRET as Secret;

    if (!token) {
      res.status(401).json({ message: "Session expired", currentRole: role });
      return;
    }

    try {
      // verifies access token
      const decoded = jwt.verify(token, accessSecret) as JwtPayload;

      // checks if user is blocked
      if (decoded.role === "user") {
        const user = await User.findById(decoded.userId);

        if (user && user.isBlocked) {
          await redis.del(`refreshToken:${decoded.userId}:${decoded.role}`);
          res.clearCookie("access_token").status(401).json({
            message: "You are blocked by admin",
            currentRole: decoded.role,
          });
          return;
        }
      }

      // checks for unauthorized access
      if (decoded.role !== role) {
        res
          .status(403)
          .json({ message: "Unauthorized access", currentRole: decoded.role });
        return;
      }

      req.currentRole = decoded.role;

      // go to next route handler
      next();
    } catch (err) {
      // verifies refresh token even if expired
      const decoded = jwt.verify(token, accessSecret, {
        ignoreExpiration: true,
      }) as JwtPayload;

      try {
        // getting refresh token from redis
        const refreshToken = await redis.get(
          `refreshToken:${decoded.userId}:${decoded.role}`
        );

        if (!refreshToken) {
          res.clearCookie("access_token").status(401).json({
            message: "Session expired",
            currentRole: decoded.role,
          });
          return;
        }

        // checks whether refresh token is valid or not
        jwt.verify(refreshToken, refreshSecret);

        // checks if user is blocked
        if (decoded.role === "user") {
          const user = await User.findById(decoded.userId);

          if (user && user.isBlocked) {
            await redis.del(`refreshToken:${decoded.userId}:${decoded.role}`);
            res.clearCookie("access_token").status(401).json({
              message: "You are blocked by admin",
              currentRole: decoded.role,
            });
            return;
          }
        }

        // creating a new access token
        const accessToken = generateAccessToken(decoded.userId, role);

        // configuring cookie
        res.cookie("access_token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        req.currentRole = decoded.role;

        next();
      } catch (err) {
        await redis.del(`refreshToken:${decoded.userId}:${decoded.role}`);
        res.clearCookie("access_token").status(401).json({
          message: "Invalid refresh token",
          currentRole: decoded.role,
        });
        return;
      }
    }
  };
};

export default checkAuth;
