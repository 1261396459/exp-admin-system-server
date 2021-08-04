var mysql = require('mysql')
const db_config={
    host:"localhost",
    user:"root",
    password:"",
    port:"3306",
    database:"exp_admin_system" 
}
let connection=mysql.createConnection(db_config);

//开始连接数据库
const startLink = function(){
    connection=mysql.createConnection(db_config);
    connection.connect(function(err){
        if(err){
            console.log(`mysql连接失败: ${err}!`);
        }else{
            console.log("mysql连接成功!");
        }
    });
};

//关闭数据库连接
const endLink = function(){
    connection.end((err)=>{
        if(err){
            console.log(`mysql关闭失败:${err}!`);
        }else{
            console.log('mysql关闭成功!');
        }
    });
}

module.exports = {
    Add(addSql, addSqlParams){
        startLink();
        connection.query(addSql,addSqlParams,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }   
           console.log('--------------------------INSERT----------------------------');
           //console.log('INSERT ID:',result.insertId);        
           console.log('INSERT ID:',result);        
           console.log('-----------------------------------------------------------------');  
        });
        endLink();
    },
    Delete(delSql){
        startLink();
        connection.query(delSql,function (err, result) {
            if(err){
                console.log('[DELETE ERROR] - ',err.message);
                return;
            }            
           console.log('--------------------------DELETE----------------------------');
           console.log('DELETE affectedRows',result.affectedRows);
           console.log('-----------------------------------------------------------------');  
        });
        endLink();
    },
    Query(sqlQuery){
        startLink();
        connection.query(sqlQuery,function (err, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
           console.log('--------------------------SELECT----------------------------');
           console.log(result);
           console.log('------------------------------------------------------------');  
        });
        endLink();
    },
    Update(modSql,modSqlParams){
        startLink();
        connection.query(modSql,modSqlParams,function (err, result) {
            if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }        
           console.log('--------------------------UPDATE----------------------------');
           console.log('UPDATE affectedRows',result.affectedRows);
           console.log('-----------------------------------------------------------------');
        });
        endLink();
    }
}
