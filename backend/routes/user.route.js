import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { editProfile, getCurrentUser, getOtherUsers, search } from '../controller/user.controllers.js';
import upload from '../middleware/multer.js';


const userRouter = express.Router();

userRouter.get("/current",isAuth, getCurrentUser);
userRouter.put("/profile", isAuth, upload.single("image"), editProfile);
userRouter.get("/others", isAuth, getOtherUsers);
userRouter.get("/search", isAuth, search);

export default userRouter;