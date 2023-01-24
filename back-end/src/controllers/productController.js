const Category = require("../models/category");
const Product = require("../models/product");

const nameSpace = "ProductController";
//get All products
exports.getaAllProducts = async (req, res) => {
  try {
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let order = req.query.order ? req.query.order : "asc";
    const products = await Product.find()
      .populate("category")
      .sort([[sortBy, order]]);

    return res.status(200).send(products);
  } catch (error) {
    console.log("Error in : " + nameSpace + " Error :" + error);
  }
};

//get all Catgories
exports.getAllCatgeories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).send(categories);
  } catch (error) {
    console.log("Error in : " + nameSpace + " Error :" + error);
  }
};

//get a product by categoryId
exports.getaProductsByCategoryId = async (req, res) => {
  try {
    const category = req.category;
    const products = await Product.find({
      category: { _id: category._id },
    }).populate("category");
    return res.status(200).json(products);
  } catch (error) {
    console.log("Error in : " + nameSpace + " Error :" + error);
  }
};

//check if category exists
exports.categoryId = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(404).json({
        error: "Category not found !",
      });
    }

    req.category = category;
    next();
  });
};
