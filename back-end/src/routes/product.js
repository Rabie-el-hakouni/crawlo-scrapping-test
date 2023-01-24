const express = require('express');

const router = express.Router();

const { 
    getAllCatgeories,
    getaProductsByCategoryId,
    categoryId,
    getaAllProducts } = require('../controllers/productController');

    //router get all Products 
    router.get('/products', getaAllProducts);

    //get Product by Category
    router.get('/products/:categoryId' , getaProductsByCategoryId);

    //get all Ctaegories
    router.get('/categories' , getAllCatgeories);

    router.param('categoryId', categoryId);

module.exports = router;