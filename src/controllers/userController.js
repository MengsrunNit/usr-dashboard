const User = require("../models/user");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: [
        "userId",
        "name",
        "email",
        "phoneNumber",
        "role",
        "status",
        "lastLoginAt",
      ],
      order: [["userId", "DESC"]],
    });

    return res.render("admin/users", {
      pageTitle: "User Management",
      users,
    });
  } catch (err) {
    return next(err);
  }
};

const getAddUser = (req, res, next) => {
  return res.render("admin/add-user", {
    pageTitle: "Add User",
  });
};

const postAddUser = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, status, role } = req.body;

    if (!name || !email || !password || !phoneNumber || !status || !role) {
      return res.status(400).render("admin/add-user", {
        pageTitle: "Add User",
        error:
          "Name, email, password, phone number, status, and role are required.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      passwordHash,
      phoneNumber,
      status,
      role,
      lastLoginAt: new Date(),
    });

    return res.redirect("/getUser");
  } catch (err) {
    return next(err);
  }
};

module.exports = { getUsers, getAddUser, postAddUser };
