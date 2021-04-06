const jsonwebtoken = require("jsonwebtoken");
const config = require("./config");
const authtokens = require("./authTokens");

function verifyToken(req, res, next) {
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).json({ auth: false, message: "No token provided." });

  jsonwebtoken.verify(token, config.secret, function (err, decoded) {
    if (err) {
      if (err.message === "jwt expired") {
        delete authtokens[token];
        return res
          .status(440)
          .json({ auth: false, message: "Session Expired" });
      }
      return res
        .status(401)
        .json({ auth: false, message: "Failed to authenticate token." });
    }
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
}

module.exports = verifyToken;
