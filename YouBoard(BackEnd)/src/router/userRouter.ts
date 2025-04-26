import express from "express";
import {
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
} from "../controllers/userControllers/userController";
import checkAuth from "../middleware/checkAuth";
import {
  getUserInfo,
  updateName,
  changePassword,
  uploadImage,
  removeImage,
} from "../controllers/userControllers/profileController";
import upload from "../middleware/upload";

const userRouter = express.Router();

// Routes for handling requests from user
userRouter.post("/check-auth", checkAuth("user"), checkUserAuth);
userRouter.get("/check-email", checkEmail);
userRouter.put("/send-verification-email", sendVerificationEmail);
userRouter.get("/verify-email", verifyEmail);
userRouter.delete("/check-verification-status/:email", checkVerificationStatus);
userRouter.put("/store-password", storePassword);
userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.delete("/signout", signout);
userRouter.put("/reset-password", resetPassword);

// Routes for handling requests from user profile
userRouter.get("/get-user-info/:userId", checkAuth("user"), getUserInfo);
userRouter.put("/update-name", checkAuth("user"), updateName);
userRouter.put("/change-password", checkAuth("user"), changePassword);
userRouter.post(
  "/upload-image",
  checkAuth("user"),
  upload.single("image"),
  uploadImage
);
userRouter.delete("/remove-image/:userId", checkAuth("user"), removeImage);

export default userRouter;
