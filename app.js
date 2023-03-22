require("dotenv").config();

const flash = require("express-flash");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const expressLayouts = require("express-ejs-layouts");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

///// MongoDB /////
const connectDB = require("./server/config/db");
connectDB();

///// Authentication /////
const session = require("express-session");
const passport = require("passport");   // use for login
const MongoStore = require("connect-mongo");

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: { maxAge: new Date(Date.now() + (604800000)) } // 7 days = 7 * 24 * 60 * 60 * 1000 = 604800000
}));

app.use(passport.initialize());
app.use(passport.session());

///// static files /////
app.use(express.static("public"));

///// Templating Engine /////
app.use(expressLayouts);
app.set("view engine", "ejs");
// set custom default layout "main"
app.set("layout", "./layouts/main");


///// Routes /////
app.use('/', require("./server/routes/auth"));
app.use('/', require("./server/routes/index"));
app.use('/', require("./server/routes/dashboard"));

// handle 404
app.get("*", (req, res) => {
    res.status(404).send("404 Page Not Found");
});

app.listen(PORT, () => console.log("server is running"));