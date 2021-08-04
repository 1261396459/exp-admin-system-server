var mysql = require('mysql')
const db_config = {
    host: "localhost",
    user: "root",
    password: "",
    port: "3306",
    database: "exp_admin_system"
}
let pool = mysql.createPool(db_config);

// 封装连接
const Query = function (mode,sql,sqlParams,success) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(`mysql连接失败: ${err}!`);
        } else {
            console.log("mysql连接成功!");
            // execution(connection);
            connection.query(sql, sqlParams, function (err, result) {
                if (err) {
                    console.log(`[${mode} ERROR] - `, err.message);
                    return;
                }
                console.log(`--------------------------${mode}----------------------------`);
                success(result);
                console.log('-----------------------------------------------------------------');
            });
            connection.release();
        }
    });
};


module.exports = {
    // CURD
    // 使用params而不是sql拼接，防sql注入
    Create(addSql, addSqlParams) {
        Query('INSERT',addSql, addSqlParams, (res)=>{
            console.log('INSERT ID:', res);
        });
    },
    Delete(delSql, delSqlParams) {
        Query('DELETE', delSql, delSqlParams, (res)=>{
            console.log('DELETE affectedRows', res.affectedRows);
        });
    },
    Retrieve(retSql, retSqlParams) {
        Query('SELECT', retSql, retSqlParams, (res)=>{
            console.log(res);
        });
    },
    Update(modSql, modSqlParams) {
        Query('UPDATE', modSql, modSqlParams, (res)=>{
            console.log('UPDATE affectedRows', res.affectedRows);
        });
    }
}
