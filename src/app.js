require("dotenv").config();
const express = require("express");
const path = require("path");
const errorController = require("./controllers/error");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Views (EJS templates)
app.set("view engine", "ejs");
app.set("views", require("path").join(__dirname, "../templates"));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (change if you keep assets elsewhere)
const isProd = process.env.NODE_ENV === "production";
if (!isProd) {
  app.disable("view cache");
}
app.use(
  express.static(path.join(__dirname, "public"), {
    etag: true,
    maxAge: isProd ? "7d" : 0,
  })
);

app.use((req, res, next) => {
  res.locals.path = req.path; // so you don’t have to pass path manually
  res.locals.user = req.session?.user || null; // or however you store user
  next();
});

// Routes
app.use(userRoutes);

// 404 fallback
app.use(errorController.error404);

module.exports = app;
