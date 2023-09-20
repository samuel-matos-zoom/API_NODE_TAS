const mysql = require('mysql2');
exports.execSQLQuery = (sqlQry, res, cliente) => {
  let config = {};

  switch (parseInt(cliente)) {
    case 1:
      config = {
        host: '54.243.64.53',
        port: 3306,
        user: 'unisin',
        password: '3G%949iYwCc2',
        database: 'unisin'
      };
      break;
    case 2:
      config = {
        host: '18.191.1.58',
        port: 3306,
        user: 'devplataformagit_user',
        password: '8$Oy237zKySg',
        database: 'tasdev'
      };
      break;
    default:
      config = {}
  }
  const connection = mysql.createConnection(config);


  connection.query(sqlQry[0], sqlQry[1], (error, results) => {
    if (error) {
      res(error);
    }
    else {
      res(results);
      console.log('executou!');
      connection.end();
    }

  });

}
