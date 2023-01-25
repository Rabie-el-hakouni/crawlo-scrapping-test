const express = require("express");
const scrappAllUrls = require("../scrapping/scrapper");

//-------------------------Scrap Router-----------------------------------//
const router = express.Router();
//start scraping by this route
router.get("/scrap", (req, res) => {
  try {
    scrappAllUrls();
    return res.status(200).json({
      message: "data scrapped successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
