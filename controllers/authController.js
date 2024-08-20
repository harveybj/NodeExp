//User Authorization related logic
const userDB = {
  users: require("../model/user.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const fsPromises = require("fs/promises");
require("dotenv").config();

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  const foundUser = userDB.users.find((person) => person.username === username);
  if (!foundUser) {
    return res.sendStatus(401);
  }
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    // create JWTs
    const roles = Object.values(foundUser.roles);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // Saving refreshToken with current user - Do this in DB later
    const otherUsers = userDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    userDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "user.json"),
      JSON.stringify(userDB.users)
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // res.json({ accessToken });
    res.json({
      success: `User access token's generated successfully`,
      accessToken: { accessToken },
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
