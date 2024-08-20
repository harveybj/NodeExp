//logout settings
const userDB = {
  users: require("../model/user.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;
  //is refresh token in db?
  const foundUser = userDB.users.find(
    (user) => user.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  //delete refresh token from db
  const otherUsers = userDB.users.filter(
    (user) => user.username !== foundUser.username
  );
  const currentUser = { ...foundUser, refreshToken: "" };
  userDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "user.json"),
    JSON.stringify(userDB.users)
  );
  res.clearCookie("jwt", { httpOnly: true, sameSite: 'None', secure: true }); 
  res.sendStatus(204);
};

module.exports = { handleLogout };
