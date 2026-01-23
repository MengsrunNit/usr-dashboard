// require("dotenv").config();
// const express = require("express");
// const path = require("path");
// const errorController = require("./controllers/error");
// const userRoutes = require("./routes/userRoutes");
// require("./models/associations");

// const app = express();

// // Views (EJS templates)
// app.set("view engine", "ejs");
// app.set("views", require("path").join(__dirname, "../templates"));

// // Body parsers
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Static files (change if you keep assets elsewhere)
// const isProd = process.env.NODE_ENV === "production";
// if (!isProd) {
//   app.disable("view cache");
// }
// app.use(
//   express.static(path.join(__dirname, "public"), {
//     etag: true,
//     maxAge: isProd ? "7d" : 0,
//   })
// );

// app.use((req, res, next) => {
//   res.locals.path = req.path; // so you don’t have to pass path manually
//   res.locals.user = req.session?.user || null; // or however you store user
//   next();
// });

// // Routes
// app.use(userRoutes);

// // 404 fallback
// app.use(errorController.error404);

// module.exports = app;

require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const env = require("./config/env");

const errorController = require("./controllers/error");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const jobItemRoutes = require("./routes/jobItemRoutes");

// Load model associations early
require("./models/associations");

const app = express();

// Views (EJS templates)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../templates"));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions (REQUIRED for req.session.user)
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8,
    },
  }),
);

// Static files
const isProd = process.env.NODE_ENV === "production";
if (!isProd) app.disable("view cache");

app.use(
  express.static(path.join(__dirname, "public"), {
    etag: true,
    maxAge: isProd ? "7d" : 0,
  }),
);

// Make user + path available in every EJS view
app.use((req, res, next) => {
  res.locals.path = req.path;
  res.locals.user = req.session?.user || null;
  next();
});

// Routes
app.use(userRoutes);
app.use(jobRoutes);
app.use(jobItemRoutes);

// 404 fallback
app.use(errorController.error404);

module.exports = app;
