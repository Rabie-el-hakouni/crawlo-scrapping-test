const express = require("express");

//-----------------------------Product Router-----------------------------------//
const router = express.Router();

const {
  getAllCatgeories,
  getaProductsByCategoryId,
  categoryId,
  getaAllProducts,
} = require("../controllers/productController");

//router get all Products
router.get("/products", getaAllProducts);

//get Product by Category
router.get("/products/:categoryId", getaProductsByCategoryId);

//get all Ctaegories
router.get("/categories", getAllCatgeories);

//middlawre
router.param("categoryId", categoryId);

module.exports = router;
