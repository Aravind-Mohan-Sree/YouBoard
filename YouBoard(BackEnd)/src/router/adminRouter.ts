import express from "express";
import {
  checkAdminAuth,
  checkEmail,
  signin,
  signout,
} from "../controllers/adminControllers/adminController";
import checkAuth from "../middleware/checkAuth";
import {
  editUserAccess,
  getUsers,
} from "../controllers/adminControllers/dashboardController";
import {
  checkUserEmail,
  storeUserPassword,
  userSignup,
} from "../controllers/adminControllers/addUserController";
import {
  getUserInfo,
  removeUserImage,
  updateUserName,
  uploadUserImage,
} from "../controllers/adminControllers/editUserController";
import upload from "../middleware/upload";

const adminRouter = express.Router();

// Routes for handling requests from admin
adminRouter.post("/check-auth", checkAuth("admin"), checkAdminAuth);
adminRouter.get("/check-email", checkEmail);
adminRouter.post("/signin", signin);
adminRouter.delete("/signout", signout);

// Routes for handling requests from admin dashboard
adminRouter.get("/get-users", checkAuth("admin"), getUsers);

// Routes for handling requests from admin - add user
adminRouter.get("/check-user-email", checkAuth("admin"), checkUserEmail);
adminRouter.put("/store-user-password", checkAuth("admin"), storeUserPassword);
adminRouter.post("/user-signup", checkAuth("admin"), userSignup);

// Routes for handling requests from admin - edit user
adminRouter.get("/get-user-info/:userId", checkAuth("admin"), getUserInfo);
adminRouter.put("/update-username", checkAuth("admin"), updateUserName);
adminRouter.post(
  "/upload-user-image",
  checkAuth("admin"),
  upload.single("image"),
  uploadUserImage
);
adminRouter.delete(
  "/remove-user-image/:userId",
  checkAuth("admin"),
  removeUserImage
);

// Routes for handling requests from admin - edit user access
adminRouter.put("/edit-user-access", checkAuth("admin"), editUserAccess);

export default adminRouter;
