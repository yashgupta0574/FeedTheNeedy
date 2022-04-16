const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const FoodSiteSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    contact: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  opts
);

FoodSiteSchema.virtual("properties.popUpMarkup").get(function () {
  return `
    <strong><a href="/foodsites/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 25)}...</p>`;
});

module.exports = mongoose.model("Foodsite", FoodSiteSchema);
