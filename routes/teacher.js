var express = require('express');
var router = express.Router();
const database = require('../api/database.js');

// 查看实验大课表
router.get('/big', function (req, res, next) {
    let tid = req.query.uid;
    console.log(tid);
    database.Retrieve(`
        SELECT CID,CNAME,CNUM,CLNs,LinkIDs
        FROM Couinfor
        LEFT JOIN(
            SELECT EID,GROUP_CONCAT(CLNAME)AS CLNs,GROUP_CONCAT(ID)AS LinkIDs
            FROM exptoclass
            GROUP BY EID
        )AS Temp ON Temp.EID=Couinfor.CID
        WHERE TID=? AND CNUM IS NOT NULL;
    `,
    [tid], (result) => {
        res.send(result);
    });
});

// 查看可以创建实验大课的课程
router.get('/can-big', function (req, res, next) {
    let tid = req.query.uid;
    console.log(tid);
    database.Retrieve(`
        SELECT CID,CNAME
        FROM Couinfor
        WHERE TID=? AND CNUM IS NULL;
    `,
    [tid], (result) => {
        res.send(result);
    });
});

// 创建/修改实验大课信息
router.put('/to-big', function (req, res, next) {
    let cid = req.body.id;
    let cnum = req.body.number;
    console.log(cid, cnum);
    database.Update(`
        UPDATE Couinfor
        SET CNUM=?
        WHERE CID=?;
    `,
    [cnum, cid], (result) => {
        res.send(result);
    });
});

// 查看我的申请
router.get('/application', function (req, res, next) {
    let tid = req.query.uid;
    console.log(tid);
    database.Retrieve(`
        SELECT *
        FROM Application
        WHERE EID IN (
            SELECT CID
            FROM Couinfor
            WHERE TID=?
        );
    `,
    [tid], (result) => {
        res.send(result);
    });
});

// 查看对于实验大课SPC可以申请的实验室
router.get('/big-can', function (req, res, next) {
    let cid = req.query.id;
    console.log(cid);
    database.Retrieve(`
        SELECT LNAME
        FROM Supports
        WHERE SPC=?;
    `,
    [cid], (result) => {
        res.send(result);
    });
});

// 发起实验室申请
router.post('/add-application', function (req, res, next) {
    let eid = req.body.id;
    let lab = req.body.lab;
    let aptime = req.body.time;
    console.log(eid, lab, aptime);
    database.Create(`
        INSERT application(LNAME,EID,APTIME)
        VALUES
        (?,?,?);
    `,
    [lab, eid, aptime], (result) => {
        res.send(result);
    });
});

// 查看对于实验大课EID的实验小课表
router.get('/small', function (req, res, next) {
    let eid = req.query.id;
    console.log(eid);
    database.Retrieve(`
        SELECT Small.*,SNUM,CPNUM
        FROM \`实验小课表\` AS Small
        LEFT JOIN(
            SELECT APEID,COUNT(STID)AS SNUM
            FROM Signin
            GROUP BY APEID
        )AS SignS ON SignS.APEID=Small.APID
        LEFT JOIN \`实验课人数表\`AS NumS ON NumS.EID=Small.EID
        WHERE Small.EID=?;
    `,
    [eid], (result) => {
        res.send(result);
    });
});

module.exports = router;