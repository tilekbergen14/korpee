const jwt = require("jsonwebtoken");

async function authentication(req, res, next) {
  try {
    const authHeaders = req.headers["authorization"];
    const token = authHeaders && authHeaders.split(" ")[1];
    if (!token) return res.status(401).json("Something went wrong! Try again!");
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json("Something went wrong");
      }
      req.user = user;
      next();
    });
  } catch (err) {
    res.status(500).json("something went wrong");
  }
}

module.exports = authentication;
