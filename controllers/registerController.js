//User login related logic
const userDB = {
    users: require("../model/user.json"),
    setUsers: function (data) {
        this.users = data;
    },
};

const fsPromises = require("fs").promises;
const path = require("path");
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
    const duplicate = userDB.users.find((user) => user.username === user);

    if (duplicate) {
        return res
            .status(409)
            .json({ message: "Username already exists" });
    }
    try {
        const hashedPwd = await bcrypt.hash(password, 10);
        const newUser = {
            username: name,
            roles: { User: 2001 },
            email: email,
            password: hashedPwd,
        };
        userDB.setUsers([...userDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "user.json"),
            JSON.stringify(userDB.users)
        );
        res.status(201).json({ success: true, message: "User created" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { handleNewUser };