// express wiring 

const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const crypto = require('crypto');


const { SESSION_SECRET, NODE_ENV } = require("./config/env");
const { pool } = require("./config/db");
const { errorHandler } = require("./middlewares/errors");
const { requireAuth } = require("./middlewares/auth");

// ---- Routes (MVC) ----
const authRoutes = require("./routes/authRoutes");
const jobsRoutes = require("./routes/jobsRoutes");
const timeRoutes = require("./routes/timeRoutes");
const bonusRoutes = require("./routes/bonusRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const reportsRoutes = require("./routes/reportsRoutes");

const app = express();

// Behind a proxy/load balancer? (Heroku, Render, Nginx, etc.)
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "same-site" },
  })
);

// --- Basic telemetry & performance ---
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.use(compression());

// --- CORS (internal-first: lock down by default) ---
app.use(cors({ origin: false })); // set to your domain(s) if needed

// --- Parsers with sane limits ---
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// --- Sessions (PG-backed) ---
app.use(
  session({
    store: new pgSession({ pool }),
    secret: SESSION_SECRET,
    name: "usr.sess",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: NODE_ENV === "production", // true behind HTTPS
      maxAge: 1000 * 60 * 60 * 8, // 8h
    },
  })
);

// --- Lightweight request id (for logs & audit correlation) ---
app.use((req, res, next) => {
  req.id =
    req.headers["x-request-id"] ||
    crypto.randomBytes(12).toString("hex");
  res.setHeader("X-Request-Id", req.id);
  next();
});

// --- Health checks (no auth) ---
app.get("/healthz", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// ---- Public (no auth) ----
app.use("/api/v1/auth", authRoutes);

// ---- Authenticated API ----
app.use("/api/v1", requireAuth);           // everything below requires login
app.use("/api/v1/jobs", jobsRoutes);
app.use("/api/v1/time", timeRoutes);
app.use("/api/v1/bonuses", bonusRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/reports", reportsRoutes);

// ---- 404 for unknown API routes ----
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "Not found" });
  }
  next();
});

// ---- Centralized error handler ----
app.use(errorHandler);

module.exports = app;
