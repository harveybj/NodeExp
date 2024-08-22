//handle refresh token
const User = require("../model/Users");
const jwt = require("jsonwebtoken");

//handle refresh token
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  // const foundUser = userDB.users.find(
  //   (person) => person.refreshToken === refreshToken
  // );
  const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
  // The line of code above is using the mongoose ORM to query the database for a user object that has a refreshToken property that matches the refreshToken value obtained from the cookie in the request. The .exec() method at the end of the query is necessary to actually execute the query and return a Promise that resolves to the user object (or null if no such user exists).

  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
