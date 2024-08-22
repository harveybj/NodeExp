const User = require("../model/Users");

const handleLogout = async (req, res) => {

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;
  
  //is refresh token in db?
  const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();  
  // const foundUser = userDB.users.find(
    // (user) => user.refreshToken === refreshToken
  // );
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  //delete refresh token in db
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);


  //send status 204
  //delete cookie
  res.clearCookie("jwt", { httpOnly: true, sameSite: 'None', secure: true }); 
  res.sendStatus(204);
};

module.exports = { handleLogout };
