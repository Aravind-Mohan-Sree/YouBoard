import { Request, Response } from "express";
import Admin from "../../models/Admin";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";
import { redis } from "../../services/redis";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

// Checks admin authentication
const checkAdminAuth = (req: Request, res: Response) => {
  const currentRole = (req as any).currentRole;

  res
    .status(200)
    .json({ message: "Authentication credentials are valid", currentRole });
};

// Check whether email exist or not
const checkEmail = async (req: Request, res: Response) => {
  try {
    const rawEmail = req.query.email;
    const email =
      typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : undefined;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      res.status(409).json({ message: "Email not exists" });
      return;
    }

    res.status(200).end();
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });

    console.log("Error checking email", error);
  }
};

// Will handle admin signin
const signin = async (req: Request, res: Response) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password.trim();

    const admin = await Admin.findOne({ email });

    if (!admin) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      res.status(409).json({ message: "Wrong password" });
      return;
    }

    const accessToken = generateAccessToken(admin?.id, "admin");
    const refreshToken = generateRefreshToken(admin?.id);

    // configuring cookie
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Store refresh token in redis
    await redis.setEx(
      `refreshToken:${admin?.id}:admin`,
      7 * 24 * 60 * 60,
      refreshToken
    );

    res.status(200).json({
      message: "Signin successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });

    console.log(error);
  }
};

// Will handle admin signout
const signout = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_SECRET as Secret,
      { ignoreExpiration: true }
    ) as JwtPayload;

    await redis.del(`refreshToken:${decoded.userId}:admin`);

    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Signout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

export { checkAdminAuth, checkEmail, signin, signout };
