const authtokens = require("../authTokens");

module.exports = function isAdmin(req, res, next){
    const user = authtokens[req.headers["x-access-token"]];
    if (user.type === "admin"){
        next()
    }
    else {
        res.json({message: "Unauthenticated user"})
    }
}