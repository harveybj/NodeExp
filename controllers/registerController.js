const User = require("../model/Users");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  } else if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  } else if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address" });
  }

  const duplicate = await User.findOne({ username: name }).exec();
  if (duplicate) {
    return res.status(409).json({ message: "Username already exists" });
  }
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    //create and store the new user
    const result = await User.create({
      username: name,
      email: email,
      password: hashedPwd,
    });

    console.log(result);
    res.status(201).json({ success: true, message: "User created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { handleNewUser };
