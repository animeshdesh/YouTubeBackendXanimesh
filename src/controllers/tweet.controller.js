import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;

    const user_id = req.user._id;

    if (!content) {
      throw new ApiError(404, "Content cannot be empty");
    }
    const createTweet = await Tweet.create({
      owner: user_id,
      content: content,
    });

    if (!createTweet) {
      throw new ApiError(500, "Error while creating a tweet");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, { createTweet }, "successfully created tweet")
      );
  } catch (error) {
    throw new ApiError(400, "Unable to create to tweet");
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  try {
    const user_id = req.user._id;
    if (!user_id) {
      throw new ApiError(401, "Access Denied");
    }

    const userTweets = await Tweet.find({ owner: user_id });

    if (!userTweets) {
      throw new ApiError(404, "No tweets found for the user");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { userTweets },
          "User tweets retrieved successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error while fetching user tweets");
  }
});

const updateTweet = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;
    const { content } = req.body;
    console.log(content, tweetId);
    const userId = req.user._id;
    const ownerDetails = await Tweet.findOne({
      owner: new mongoose.Types.ObjectId(userId),
    }).select("-content");

    if (!ownerDetails) {
      throw new ApiError(401, "User not found");
    }
    const updateTweet = await Tweet.updateOne(
      {
        _id: tweetId,
        owner: userId,
      },
      {
        $set: { content: content },
      }
    );

    if (!updateTweet) {
      throw new ApiError(500, "Unable to Update tweet");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, { updateTweet }, "Tweet Updated successfully")
      );
  } catch (error) {
    throw new ApiError(401, "something went wrong while updating tweet");
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  try {
    const user_id = req.user._id;
    const { commentId } = req.params;
    const ownerDetails = await Tweet.findOne({
      owner: new mongoose.Types.ObjectId(user_id),
    }).select("-content");
    if (!ownerDetails) {
      throw new ApiError(401, "You are not Authenticated");
    }
    const deletedTweet = await Tweet.findByIdAndDelete(commentId);
    if (!deletedTweet) {
      throw new ApiError(500, "Unable to Delete tweet");
    }
    res.status(200).json(new ApiResponse(200, { deleteTweet }, "Success"));
  } catch (error) {
    throw new ApiError(401, "Something went while deleting tweet");
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
