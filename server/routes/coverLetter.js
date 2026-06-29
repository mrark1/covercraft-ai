const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {

    generateCoverLetter

} = require("../controllers/coverLetterController");

router.post(

    "/",

    upload.single("resume"),

    generateCoverLetter

);

module.exports = router;