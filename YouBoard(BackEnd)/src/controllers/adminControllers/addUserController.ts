import { Request, Response } from "express";
import User from "../../models/User";
import validationSchema from "../../utils/validationSchema";
import { redis } from "../../services/redis";
import bcrypt from "bcrypt";

// Check whether email exist or not
const checkUserEmail = async (req: Request, res: Response) => {
  try {
    const rawEmail = req.query.email;
    const email =
      typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : undefined;
    const user = await User.findOne({ email });

    if (user) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }

    await redis.setEx(
      `auth:${email}`,
      600,
      JSON.stringify({
        email,
      })
    );

    res.status(200).end();
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });

    console.log("Error checking email", error);
  }
};

// Will validate password and store in redis
const storeUserPassword = async (req: Request, res: Response) => {
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

    res.status(200).end();
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });

    console.log(error);
  }
};

// Will handle user signup
const userSignup = async (req: Request, res: Response) => {
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

    res.status(201).json({ message: "User added" });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });

    console.log(error);
  }
};

export { checkUserEmail, storeUserPassword, userSignup };
