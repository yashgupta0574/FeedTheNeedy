const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("./register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to FeedTheNeedy!");
      res.redirect("/foodsites");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("./register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("./login");
};

module.exports.login = (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = req.session.returnTo || "/foodsites";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Goodbye! Visit Again :)");
  res.redirect("/foodsites");
};
