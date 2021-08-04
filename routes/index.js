var express = require('express');
var router = express.Router();
const database = require('../api/database.js');

router.post('/login', function (req, res, next) {
  let acc = req.body.a;
  let pass = req.body.p;
  console.log(acc, pass);
  database.Retrieve(' \
    SELECT BELONG,POWER \
    FROM Users \
    WHERE ACCOUNT=? AND PASSWORD=?; \
  ', [acc, pass], (result) => {
    res.send(result);
  });
});

module.exports = router;
