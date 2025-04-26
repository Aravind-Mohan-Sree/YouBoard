import { Request, Response } from "express";
import User from "../../models/User";
import validationSchema from "../../utils/validationSchema";
import bcrypt from "bcrypt";
import cloudinary from "../../services/cloudinary";

// Will send user details
const getUserInfo = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User fetched", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

// Will update user name
const updateName = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const name = req.body.name.trim();
    const result = validationSchema.pick({ name }).safeParse({ name });

    if (!result.success) {
      res.status(400).json({ message: "Name validation failed" });
      return;
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    await User.updateOne({ _id: userId }, { name });

    res.status(200).json({ message: "Name updated", name });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

// Will update user password
const changePassword = async (req: Request, res: Response) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const currentPassword = req.body.currentPassword.trim();
    const newPassword = req.body.newPassword.trim();

    const user = await User.findOne({ email });

    const match = await bcrypt.compare(currentPassword, user!.password);

    if (!match) {
      res.status(400).json({ message: "Wrong password" });
      return;
    }

    await User.updateOne(
      { email },
      { password: await bcrypt.hash(newPassword, 10) }
    );

    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

// Will upload user image to cloudinary
const uploadImage = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const result = cloudinary.uploader.upload_stream(
      {
        folder: "user-profiles",
        public_id: `user_${userId}`,
        overwrite: true,
      },
      async (error, result) => {
        if (error || !result) {
          res.status(400).json({ message: "Image upload failed" });
          return;
        }

        await User.updateOne({ _id: userId }, { imageUrl: result?.secure_url });

        res
          .status(200)
          .json({ message: "Image uploaded", imageUrl: result?.secure_url });
      }
    );

    req.file?.buffer && result.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

// Will remove user image from cloudinary
const removeImage = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await cloudinary.uploader.destroy(
      `user-profiles/user_${userId}`,
      async (error, result) => {
        if (error || !result) {
          res.status(400).json({ message: "Image removal failed" });
          return;
        }

        await User.findByIdAndUpdate(userId, { imageUrl: "" });

        res.status(200).json({ message: "Image removed" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export { getUserInfo, updateName, changePassword, uploadImage, removeImage };
