const express = require("express");
const router = express.Router();
const foodsites = require("../controllers/foodsites");
const catchAsync = require("../catchAsync");
const { isLoggedIn, isAuthor, validateFoodsite } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(foodsites.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateFoodsite,
    catchAsync(foodsites.createFoodsite)
  );

router.get("/new", isLoggedIn, foodsites.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(foodsites.showFoodsite))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateFoodsite,
    catchAsync(foodsites.updateFoodsite)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(foodsites.deleteFoodsite));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(foodsites.renderEditForm)
);

module.exports = router;
