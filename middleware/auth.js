const jwt = require("jsonwebtoken");
const { giveResponse } = require("../helper/res_help");
const User = require("../models/user");

exports.auth = async (req, res, next) => {
  try {
    const token = await req.header("Authorization")?.replace("Bearer ", "");
    if (token == null || token == "undefined") {
      giveResponse(res, 401, false, "Please set token");
    } else {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      if (decode == "undefined" || decode == null) {
        giveResponse(res, 403, false, "token is expired");
      } else {
        const user = await User.findById(decode?.id);

        req.token = token;
        req.user = user;
        next();
      }
    }
  } catch (e) {
    console.log(e);
   return giveResponse(
      res,
      401,
      false,
      "Your session had expired, please log in again."
    );
  }
};
