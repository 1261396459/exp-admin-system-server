var express = require('express');
var router = express.Router();
const database = require('../api/database.js');

// 查看管理的实验室
router.get('/my-labs', function (req, res, next) {
    let tid = req.query.uid;
    console.log(tid);
    database.Retrieve(`
        SELECT LabInfor.LNAME,SPN,SPCs
        FROM LabInfor
        LEFT JOIN(
            SELECT LNAME,GROUP_CONCAT(CNAME,'(',SPC,')')AS SPCs
            FROM Supports
            LEFT JOIN CouInfor ON CouInfor.CID=Supports.SPC
            GROUP BY LNAME
        )AS Temp ON Temp.LNAME=LabInfor.LNAME
        WHERE AMTID=?;
    `,
    [tid], (result) => {
        res.send(result);
    });
});

// 查看支持的课程
router.get('/lab-sup', function (req, res, next) {
    let lname = req.query.lname;
    console.log(lname);
    database.Retrieve(`
        SELECT SPC AS CID,CNAME
        FROM Supports
        LEFT JOIN CouInfor ON CouInfor.CID=Supports.SPC
        WHERE LNAME=?;
    `,
    [lname], (result) => {
        res.send(result);
    });
});

// 查看不支持的课程
router.get('/lab-nsup', function (req, res, next) {
    let lname = req.query.lname;
    console.log(lname);
    database.Retrieve(`
        SELECT CID,CNAME
        FROM CouInfor
        WHERE CID NOT IN(
            SELECT SPC
            FROM Supports
            WHERE LNAME=?
        );
    `,
    [lname], (result) => {
        res.send(result);
    });
});

// 修改实验室容纳人数
router.put('/upd-lab-number', function (req, res, next) {
    let number = req.body.number;
    let lab = req.body.lab;
    console.log(number,lab);
    database.Update(`
        UPDATE LabInfor
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
        SELECT Application.*,CNAME,SPN,ExpNum.CPNUM
        FROM Application
        LEFT JOIN LabInfor ON LabInfor.LNAME=Application.LNAME
        LEFT JOIN CouInfor ON CouInfor.CID=Application.EID
        LEFT JOIN \`实验课人数表\`AS ExpNum ON ExpNum.EID=Application.EID
        WHERE LabInfor.AMTID=?;
    `,
    [tid], (result) => {
        res.send(result);
    });
});

// 同意申请
router.put('/agree-application', function (req, res, next) {
    let apid = req.body.apid;
    console.log(apid);
    database.Update(`
        UPDATE Application
        SET RESULT='3'
        WHERE APID=?;
    `,
    [apid], (result) => {
        res.send(result);
    });
});

// 拒绝申请
router.put('/disagree-application', function (req, res, next) {
    let apid = req.body.apid;
    let comment = req.body.comment;
    console.log(apid,comment);
    database.Update(`
        UPDATE Application
        SET RESULT='2',APCOMMENT=?
        WHERE APID=?;
    `,
    [comment, apid], (result) => {
        res.send(result);
    });
});

module.exports = router;
