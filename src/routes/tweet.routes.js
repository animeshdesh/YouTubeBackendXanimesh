import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  updateTweet,
  getUserTweets,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-tweet").post(verifyJWT, createTweet);
router.route("/get-all-tweets").post(verifyJWT, getUserTweets);
router.route("/:commentId").delete(verifyJWT, deleteTweet);
router.route("/:tweetId").patch(verifyJWT, updateTweet);

export default router;
