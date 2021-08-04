var express = require('express');
var router = express.Router();
const database = require('../api/database.js');

// 查看管理的实验室
router.get('/my-labs', function (req, res, next) {
    let tid = req.query.uid;
    console.log(tid);
    database.Retrieve(`
        SELECT Labinfor.LNAME,SPN,SPCs,SuIDs
        FROM Labinfor
        LEFT JOIN(
            SELECT LNAME,GROUP_CONCAT(SPC)AS SPCs,GROUP_CONCAT(ID)AS SuIDs
            FROM Supports
            GROUP BY LNAME
        )AS Temp ON Temp.LNAME=Labinfor.LNAME
        WHERE AMTID=?;
  `,
    [tid], (result) => {
        res.send(result);
    });
});

// 修改实验室容纳人数
router.put('/upd-lab-number', function (req, res, next) {
    let number = req.query.number;
    let lab = req.query.lab;
    console.log(number,lab);
    database.Update(`
        UPDATE Labinfor
        SET SPN=?
        WHERE LNAME=?;
    `,
    [number, lab], (result) => {
        res.send(result);
    });
});

// 添加实验室支持课程
router.post('/add-lab-course', function (req, res, next) {
    let eid = req.body.eid;
    let lab = req.body.lab;
    console.log(eid,lab);
    database.Create(`
        INSERT Supports(LNAME,SPC)
        VALUES
        (?,?);
    `,
    [lab, eid], (result) => {
        res.send(result);
    });
});

// 删除实验室支持课程
router.delete('/del-lab-course', function (req, res, next) {
    let eid = req.query.eid;
    let lab = req.query.lab;
    console.log(eid,lab);
    database.Delete(`
        DELETE FROM Supports
        WHERE LNAME=? AND SPC=?;
    `,
    [lab, eid], (result) => {
        res.send(result);
    });
});

// 查看我收到的申请
router.get('/application', function (req, res, next) {
    let tid = req.query.uid;
    console.log(tid);
    database.Retrieve(`
        SELECT APID,LNAME,SPN,EID,APTIME
        FROM Application
        NATURAL JOIN Labinfor
        WHERE Labinfor.AMTID=?;
    `,
    [tid], (result) => {
        res.send(result);
    });
});

// 同意申请
router.put('/agree-application', function (req, res, next) {
    let apid = req.query.apid;
    console.log(apid);
    database.Update(`
        UPDATE application
        SET RESULT='3'
        WHERE APID=?;
    `,
    [apid], (result) => {
        res.send(result);
    });
});

// 拒绝申请
router.put('/disagree-application', function (req, res, next) {
    let apid = req.query.apid;
    let comment = req.query.comment;
    console.log(apid,comment);
    database.Update(`
        UPDATE application
        SET RESULT='2',APCOMMENT=?
        WHERE APID=?;
    `,
    [comment, apid], (result) => {
        res.send(result);
    });
});

module.exports = router;
