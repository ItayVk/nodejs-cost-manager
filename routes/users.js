// Dor Bergel 322271792, Eyal Avni 212211734, Itay Vekselbum 211871827

// Requiring everything we need
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
