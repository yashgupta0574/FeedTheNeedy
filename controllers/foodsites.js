const Foodsite = require("../models/foodsite");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const foodsites = await Foodsite.find({}).populate("popupText");
  res.render("foodsites/index", { foodsites });
};

module.exports.renderNewForm = (req, res) => {
  res.render("foodsites/new");
};

module.exports.createFoodsite = async (req, res, next) => {
  const foodsite = new Foodsite(req.body.foodsite);
  foodsite.author = req.user._id;
  foodsite.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  if (foodsite.images.length > 3) {
    req.flash(
      "error",
      "Sorry! You cannot upload more than 3 images :( Add a new Foodsite with less number of images!!"
    );
    res.redirect(`/foodsites/new`);
  } else {
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.foodsite.location,
        limit: 1,
      })
      .send();
    foodsite.geometry = geoData.body.features[0].geometry;
    await foodsite.save();
    req.flash(
      "success",
      "Successfully made a new Foodsite!.....Thanks for taking initiative in helping the needy :)"
    );
    res.redirect(`/foodsites/${foodsite._id}`);
  }
};

module.exports.showFoodsite = async (req, res) => {
  const foodsite = await Foodsite.findById(req.params.id)
    .populate({
      path: "author",
    })
    .populate("author");
  if (!foodsite) {
    req.flash("error", "Requested foodsite isn't available ;)");
    return res.redirect("/foodsites");
  }
  res.render("foodsites/show", { foodsite });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const foodsite = await Foodsite.findById(id);
  if (!foodsite) {
    req.flash("error", "Requested foodsite isn't available ;)");
    return res.redirect("/foodsites");
  }
  res.render("foodsites/edit", { foodsite });
};

module.exports.updateFoodsite = async (req, res) => {
  const { id } = req.params;
  const foodsite = await Foodsite.findByIdAndUpdate(id, {
    ...req.body.foodsite,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  let delimg = 0;
  if (req.body.deleteImages) {
    delimg = req.body.deleteImages.length;
  }
  if (imgs.length + foodsite.images.length - delimg > 3) {
    req.flash(
      "error",
      "Sorry! You cannot upload more than 3 images :( Add a new Foodsite with less number of images!!"
    );
    res.redirect(`/foodsites/${foodsite._id}`);
  } else {
    foodsite.images.push(...imgs);
    await foodsite.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await foodsite.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
    req.flash("success", "Successfully updated the foodsite :)");
    res.redirect(`/foodsites/${foodsite._id}`);
  }
};

module.exports.deleteFoodsite = async (req, res) => {
  const { id } = req.params;
  await Foodsite.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted foodsite! VISIT AGAIN :)");
  res.redirect("/foodsites");
};
