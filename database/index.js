const mysql = require('mysql2');
exports.execSQLQuery = (sqlQry, res) => {

  // if (cliente == 123456789) {
  // const connection = mysql.createConnection({
  //   host: 'tasdev.vpshost5501.mysql.dbaas.com.br',
  //   port: 3306,
  //   user: 'tasdev',
  //   password: 'TasDEV495051@',
  //   database: 'tasdev'
  // });

  const connection = mysql.createConnection({
    host: '18.191.1.58',
    port: 3306,
    user: 'devplataformagit_user',
    password: '8$Oy237zKySg',
    database: 'tasdev'
  });

  connection.query(sqlQry[0], sqlQry[1], (error, results) => {
    if (error)
      res(error);
    else
      res(results);
    connection.end();
    console.log('executou!');
  });
  // }

}
