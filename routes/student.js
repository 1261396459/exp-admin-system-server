var express = require('express');
var router = express.Router();
const database = require('../api/database.js');

// 学生实验小课
router.get('/courses', function (req, res, next) {
  let stuid = req.query.uid;
  console.log(stuid);
  database.Retrieve(`
    SELECT *
    FROM \`实验小课表\`
    WHERE EID IN(
      SELECT EID
      FROM students
      NATURAL JOIN exptoclass
      WHERE STID=?
    );
  `, 
  [stuid], (result) => {
    res.send(result);
  });
});

// 查看所有签到
router.get('/sign-all', function (req, res, next) {
  let stuid = req.query.uid;
  console.log(stuid);
  database.Retrieve(`
    SELECT APID,EID
    FROM \`班级签到进行表\`
    WHERE CLNAME IN(
      SELECT CLNAME
      FROM students
      NATURAL JOIN exptoclass
      WHERE STID=?
    );
  `, 
  [stuid], (result) => {
    res.send(result);
  });
});

// 查看已经签到
router.get('/sign-already', function (req, res, next) {
  let stuid = req.query.uid;
  console.log(stuid);
  database.Retrieve(`
    SELECT APEID,TIME
    FROM signin
    WHERE STID=?;
  `, 
  [stuid], (result) => {
    res.send(result);
  });
});

// 进行签到
router.post('/tosign', function (req, res, next) {
  let apid = req.body.apid;
  let stuid = req.body.uid;
  console.log(apid,stuid);
  database.Create(`
    INSERT Signin(APEID,STID)
    VALUES
    (?,?);
  `, 
  [apid, stuid], (result) => {
    res.send(result);
  });
});

module.exports = router;
