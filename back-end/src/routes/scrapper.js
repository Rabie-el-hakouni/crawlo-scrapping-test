const express = require("express");
// const scrappAllUrls = require("../scrapping/scrapper");
const scrapData = require("../scrapping/scrapper");

//-------------------------Scrap Router-----------------------------------//
const router = express.Router();
//start scraping by this route
router.get("/scrapper/:numberCategories/:numberPages", (req, res) => {
  try {
    const { numberCategories, numberPages } = req.params;
    scrapData(numberCategories, numberPages);
    return res.status(200).json({
      message: "scrapping data .....",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
