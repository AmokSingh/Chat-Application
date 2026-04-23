import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { sendMessage } from "../controller/message.controllers.js";
import { getMessages } from "../controller/message.controllers.js";

const messageRouter = express.Router();

messageRouter.post("/send/:receiver", isAuth, upload.single("image"), sendMessage);

messageRouter.get("/get/:receiver", isAuth, getMessages);

export default messageRouter;