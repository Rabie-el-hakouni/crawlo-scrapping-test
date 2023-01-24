const express = require('express');
const scrappAllUrls = require('../../scrapper');

const router = express.Router(); 
router.get('/scrap', (req , res) => {
    try {
        //scrappAllUrls();
        return res.status(200).json({
            message : "data scrapped successfully"
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;