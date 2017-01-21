const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res)=>{
  res.status(200).json({
    message: "You have the authority to see this message."
  });
});

module.exports = router;
