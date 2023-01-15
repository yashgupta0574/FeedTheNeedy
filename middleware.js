const { FoodSiteSchema } = require("./schemas.js");
const ExpressError = require("./ExpressError");
const Foodsite = require("./models/foodsite");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Sign in first to add a new foodsite!");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateFoodsite = (req, res, next) => {
  const { error } = FoodSiteSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const site = await Foodsite.findById(id);
  if (!site.author.equals(req.user._id)) {
    req.flash("error", "Sorry you are not the creator of that foodsite!");
    return res.redirect(`/foodsites/${id}`);
  }
  next();
};
