exports.error404 = (req, res, next) => {
  res.render("404", {
    pageTitle: "Page Not Found",
    path: req.path,
    user: req.session?.user || null,
  });
};
