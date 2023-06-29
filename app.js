const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql');
var con = "";


function connect(){
    con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "933@jayanth",
    database: "parnasala"
  });
}

const db = require(__dirname + "/database.js");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


// these lines are for home route to only send data
app.get("/", function(req, res){
    connect();
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM daily_income ORDER BY date DESC LIMIT 7", function (err, data, fields) {
        if (err) throw err;
        let xArray = [];
        let yArray = [];
        const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        
        for(i=0;i<data.length;i++){ 
            let d = new Date(data[i].Date);
            let day = days[d.getDay()];
            xArray.push(day);
            yArray.push(data[i].income);
        }
        // ['Sunday','Saturday','Friday','Thursday','Wednesday','Tuesday','Monday' ]
        // [50000, 500000,500000, 500000,50000,  16737,24302]
        // Define Data
        // var data1 = [{
        //     x: xArray,
        //     y: yArray,
        //     mode:"lines"
        //     }];

        //     // Define Layout
        // var layout = {
        //     xaxis: {title: "Days"},
        //     yaxis: {range: [20000, 80000], title: "Income"},  
        //     title: "Income"
        //     };
        //     global.data = data1;
        //     global.layout = layout;
            res.render("home", {
                xArray:xArray,
                yArray:yArray
        });
        });
    });
});

// To get one day income send and receive data
app.get("/onedayincome", function(req, res){
    res.render("onedayincome");
});

app.post("/onedayincome", function(req, res){
    let amountData = Number(req.body.onedayincome);
    let dateData =  String(req.body.date);
    let data = {
        amount : amountData,
        date: dateData
    };
    db.insertIncomeData(data);
    res.redirect("/onedayincome");
});

// One day expences send file and receive data
app.get("/otherexpences", function(req, res){
    res.render("otherexpences");
});

app.post("/otherexpences", function(req, res){
    let thisname = req.body.name;
    let amountData = Number(req.body.amount);
    let desc = req.body.description;
    let dateData = req.body.date;
    // console.log(amount + " " + description + " "+ date);
    let data = {
        name: thisname,
        amount: amountData,
        description: desc,
        date:  dateData
    };
    db.insertExpences(data);
    res.redirect("/otherexpences");
});

// Display all expences of this month
app.get("/expences", function(req, res){
    connect();
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM expences ORDER BY date DESC LIMIT 30", function (err, data, fields) {
        if (err) throw err;
        res.render("expences", {
            data:data
        });
        });
    });
});

// Post request of Expences
// If user searched any thing that result will come here
app.post("/expences", function(req, res){
    let search = req.body.search;
    connect();
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM expences WHERE date REGEXP '"+search+"' or name REGEXP '"+search+"' or description REGEXP '"+search+"'" , function (err, data, fields) {
        if (err) throw err;
        res.render("expences", {
            data:data
        });
        });
    });
});

app.get("/income", function(req, res){
    connect();
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM daily_income ORDER BY date DESC", function (err, data, fields) {
        if (err) throw err;
        res.render("income", {
            data:data
        });
        });
    });
});
// select sum(income) from daily_income where Date BETWEEN '2023-04-01' and '2023-04-30';
// send owners data/income
app.get("/owner", function(req, res){

    let d = new Date();
    let day = d.getDate();
    let month = d.getMonth()+1;
    let year = d.getFullYear();
    if(month < 10)
        month = "0"+month;
    let monthStart = year+"-"+month+"-01";
    let currentDate = year+"-"+month+"-"+day;
    connect();
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT SUM(income) AS income FROM daily_income WHERE Date BETWEEN '"+monthStart+"' and '"+currentDate+"' UNION ALL SELECT SUM(amount) FROM expences WHERE Date BETWEEN '"+monthStart+"' AND '"+currentDate+"'", function (err, data, fields) {
        if (err) throw err;          
             res.render("owner",  {
                income:data[0].income,
                expences: data[1].income,
                finalIncome: data[0].income - data[1].income
            });
        });

           
    });
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});
