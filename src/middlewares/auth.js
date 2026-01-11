// Minimal auth middleware using session
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ error: "Unauthorized", requestId: req.id });
}

module.exports = { requireAuth };
