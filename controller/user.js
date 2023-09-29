const User = require("../models/user");
const { generateToken } = require("../helper/jwtToken");
const { giveResponse } = require("../helper/res_help");
const asyncHandler = require("../middleware/async");

exports.createUser = asyncHandler(async (req, res) => {
  var { username, email, password } = req.body;

  const exitsUser = await User.findOne({ email });
  if (exitsUser) {
    return giveResponse(res, 400, false, "user already exists");
  }

  const user = await User.create({
    email,
    username,
    password,
  });

  return giveResponse(res, 201, true, "user created successfully", user);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({ email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    delete req.body.password;
    return giveResponse(res, 200, true, "Login Successfull", {
      ...req.body,
      token: generateToken(findUser?._id),
    });
  } else {
    return giveResponse(res, 400, false, "Invalid Credentials");
  }
});

exports.getUser = asyncHandler(async (req, res) => {
  const userId = req.body.userId;

  if (userId) {
    const user = await User.findById(userId);
    if (!user) {
      return giveResponse(res, 404, false, "User not found");
    }
    return giveResponse(res, 200, true, "User retrieved successfully", user);
  } else {
    return giveResponse(
      res,
      500,
      false,
      "An error occurred while fetching the user"
    );
  }
});
