const bcrypt = require("bcrypt");
const User = require("../models/User");


exports.login = async (req, res) => {
    const locals = {
        title: "Login",
        description: "Journal app"
    };

    res.render("auth/login", { locals, layout: "../views/layouts/auth" });

};

exports.register = async (req, res) => {
    const locals = {
        title: "Register",
        description: "Journal app"
    };

    res.render("auth/register", { locals, layout: "../views/layouts/auth" });

};

exports.registerSubmit = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    try {
        const userEmail = await User.findOne({ email: email });

        if (userEmail) {
            res.send("User already exists, please login or use another email address to sign up.")
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                firstName: firstname,
                lastName: lastname,
                email: email,
                password: hashedPassword,
            }
            const user = await User.create(newUser);
            res.redirect("/login")
        }
    } catch {
        res.redirect("/register")
    }

};
