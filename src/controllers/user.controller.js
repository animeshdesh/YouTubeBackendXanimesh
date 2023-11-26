import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation - not empty
  //check if user already exsits : username, email
  //check if image, check for avatar
  //upload them to cloudinary, avatar
  //create user object - create entry in DB
  //remove password and refresh token field from response
  //check for user creation
  //return res

  const { fullName, email, username, password } = req.body;
  console.log(email, " email");

  //   if (fullname === "") {
  //     throw new ApiError(400, "Fullname is required");
  //   }
  //Individually we can check there is no issue with this
  //alternate more pro way to the same is below
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All field are required");
  }
  //Checking below if user already exist in DB

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  //If exisited then we are throwing error
  if (existedUser) {
    throw new ApiError(409, "User with email or username exist");
  }

  //we are getting more options from req using middleware multer
  //getting the image path from local and validating if it exist
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar Files is Required");
  }
  //uploading them from localpath to the cloudinary again validating if we have it
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  //calling model and after all the validation passing the req content from
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  //calling DB again to check if we have successfully got the user in DB
  const createdUserCheck = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUserCheck) {
    throw new ApiError(500, "Something went wrong while registering User");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(200, createdUserCheck, "User Registered Successfully")
    );
});

export { registerUser };
