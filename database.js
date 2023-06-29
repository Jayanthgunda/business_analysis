module.exports.insertIncomeData = insertIncomeData;
module.exports.insertExpences = insertExpences;
// module.exports.getAllExpences = getAllExpences;

var mysql = require('mysql');

var con = "";

function connect(){
    con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "933@jayanth",
    database: "parnasala"
  });
}

function insertIncomeData(data){
  connect();
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO daily_income VALUES ('"+data.date+ "',"+data.amount+")";
     
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
}

function insertExpences(data){
  connect();
  con.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
    var sql = "INSERT INTO expences VALUES ('"+data.date+"','"+data.name+"','"+data.description+"',"+data.amount+")";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
}
