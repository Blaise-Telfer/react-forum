const config = require("../config/db");
const jwt = require("jsonwebtoken");


const isAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const slicedToken = token.slice(7, token.length);
	jwt.verify(slicedToken, config.JWT_SECRET, (error, decode) => {
	  if(error){
		return res.status(401).send({ message: "You must be logged in to do that." });
	  }
	  req.user = decode;
	  next();
      return;
	});
  } else {
    return res.status(401).send({ message: "Unauthorized. Try logging out and logging back in." });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role == "admin") {
    return next();
  }
  return res.status(401).send({ message: "You must be an admin to do that." });
};


module.exports = { isAuth, isAdmin };