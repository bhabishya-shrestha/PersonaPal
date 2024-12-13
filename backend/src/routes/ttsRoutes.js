const express = require("express");
const router = express.Router();
const { synthesizeSpeech } = require("../controllers/ttsController");

// Text-to-Speech
router.post("/speak", synthesizeSpeech);

module.exports = router;
