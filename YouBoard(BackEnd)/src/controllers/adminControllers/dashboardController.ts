import { Request, Response } from "express";
import User from "../../models/User";

// Will query all users
const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");

    if (!users) {
      res.status(404).json({ message: "Users not found" });
    }

    res.status(200).json({ message: "Users found", users });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

// Will edit user access
const editUserAccess = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBlocked: !user.isBlocked },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: `User ${updatedUser?.isBlocked ? "blocked" : "unblocked"}`,
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export { getUsers, editUserAccess };
