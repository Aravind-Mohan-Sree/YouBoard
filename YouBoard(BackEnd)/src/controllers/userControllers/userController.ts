import { Request, Response } from "express";
import User from "../../models/User";
import { sendEmail } from "../../services/nodemailer";
import { redis } from "../../services/redis";
import path from "path";
import validationSchema from "../../utils/validationSchema";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

// Checks user authentication
const checkUserAuth = (req: Request, res: Response) => {
  const currentRole = (req as any).currentRole;

  res
    .status(200)
    .json({ message: "Authentication credentials are valid", currentRole });
};

// Check whether email exist or not
const checkEmail = async (req: Request, res: Response) => {
  try {
    const entry = req.query.entry;
    const rawEmail = req.query.email;
    const email =
      typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : undefined;
    const user = await User.findOne({ email });

    if (entry === "signup") {
      if (user) {
        res.status(409).end();
        return;
      }

      res.status(200).end();
    } else {
      if (!user) {
        res.status(409).json({ message: "Email not exists" });
        return;
      }

      if (user.isBlocked) {
        res.status(409).json({ message: "You are blocked by admin" });
        return;
      }

      res.status(200).end();
    }
  } catch (error) {
    console.log("Error checking email", error);
  }
};

// Will send verification email to user inbox
const sendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const email = req.body.email.trim().toLowerCase();

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    await sendEmail(email);

    res.status(200).json({ message: "Verification email send" });
    console.log("Verification email send");
    return;
  } catch (error) {
    res.status(500).json({ message: "Unable to send verification email" });
    console.log("Unable to send verification email");
    return;
  }
};

// Will verify the email
const verifyEmail = async (req: Request, res: Response) => {
  try {
    const token = req.query.token;
    const rawEmail = req.query.email;
    const email =
      typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : undefined;

    const data = await redis.get(`verify:${email}`);

    if (!data) {
      res
        .status(400)
        .sendFile(
          path.join(__dirname, "../../../public/verificationExpired.html")
        );
      return;
    }

    const payload = JSON.parse(data);

    if (token !== payload.token) {
      res
        .status(400)
        .sendFile(
          path.join(__dirname, "../../../public/verificationInvalid.html")
        );
      return;
    }

    payload.verified = true;

    await redis.setEx(`verify:${email}`, 60, JSON.stringify(payload));
    await redis.setEx(
      `auth:${email}`,
      600,
      JSON.stringify({
        email,
      })
    );

    res
      .status(200)
      .sendFile(path.join(__dirname, "../../../public/emailVerified.html"));
  } catch (error) {
    console.log(error);
  }
};

// Will check the status of email verification
const checkVerificationStatus = async (req: Request, res: Response) => {
  try {
    const email = req.params.email.trim().toLowerCase();

    const data = await redis.get(`verify:${email}`);

    if (!data) {
      res.status(400).json({ message: "Verification token expired" });
      return;
    }

    const payload = JSON.parse(data);

    res.json({ verified: payload.verified });

    if (payload.verified) redis.del(`verify:${email}`);
  } catch (error) {
    console.log(error);
  }
};

// Will validate password and store in redis
const storePassword = async (req: Request, res: Response) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password.trim();
    const result = validationSchema.pick({ password }).safeParse({ password });

    if (!result.success) {
      res.status(400).json({ message: "Password validation failed" });
      return;
    }

    const data = await redis.get(`auth:${email}`);

    if (!data) {
      res.status(400).json({ message: "Something went wrong" });
      return;
    }

    await redis.setEx(
      `auth:${email}`,
      600,
      JSON.stringify({
        email,
        password: await bcrypt.hash(password, 10),
      })
    );

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
  }
};

// Will handle user signup
const signup = async (req: Request, res: Response) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const name = req.body.name.trim();
    const result = validationSchema.pick({ name }).safeParse({ name });

    if (!result.success) {
      res.status(400).json({ message: "Name validation failed" });
      return;
    }

    const data = await redis.get(`auth:${email}`);

    if (!data) {
      res.status(400).json({ message: "Something went wrong" });
      return;
    }

    const payload = JSON.parse(data);

    await User.create({
      name,
      email,
      password: payload.password,
    });

    // Delete auth credentials from redis
    await redis.del(`auth:${email}`);

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.log(error);
  }
};

// Will handle user signin
const signin = async (req: Request, res: Response) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password.trim();

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isBlocked) {
      res.status(409).json({ message: "You are blocked by admin" });
      return;
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      res.status(409).json({ message: "Wrong password" });
      return;
    }

    const accessToken = generateAccessToken(user?.id, "user");
    const refreshToken = generateRefreshToken(user?.id);

    // configuring cookie
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Store refresh token in redis
    await redis.setEx(
      `refreshToken:${user?.id}:user`,
      7 * 24 * 60 * 60,
      refreshToken
    );

    res.status(200).json({
      message: "Signin successful",
      userId: user.id,
      name: user.name,
      imageUrl: user.imageUrl,
    });
  } catch (error) {
    console.log(error);
  }
};

// Will handle user signout
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

    await redis.del(`refreshToken:${decoded.userId}:user`);

    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Signout successful" });
  } catch (error) {
    res.status(400).json({ message: "Unable to signout" });
    console.log(error);
  }
};

// Will reset user password
const resetPassword = async (req: Request, res: Response) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password.trim();
    const result = validationSchema.pick({ password }).safeParse({ password });

    if (!result.success) {
      res.status(400).json({ message: "Password validation failed" });
      return;
    }

    const data = await redis.get(`auth:${email}`);

    if (!data) {
      res.status(400).json({ message: "Credentials mismatch" });
      return;
    }

    await redis.del(`auth:${email}`);

    await User.updateOne(
      { email },
      { password: await bcrypt.hash(password, 10) }
    );

    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export {
  checkUserAuth,
  checkEmail,
  sendVerificationEmail,
  verifyEmail,
  checkVerificationStatus,
  storePassword,
  signup,
  signin,
  signout,
  resetPassword,
};
