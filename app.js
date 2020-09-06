var path = require  ('path');
var ejs = require ('ejs');
var bodyParser =require('body-parser');
var mysql = require('mysql');  
var express= require('express');

var app = express();
app.set('views',path.join(__dirname,'views'));

app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));



var con = mysql.createConnection({  
  host: "127.0.0.1",  
  user: "root",  
  password: "Nepusa@100", 
  database:'bookstore'
});
con.connect(function(err) {  
    if (err) throw err;  
    console.log("Connected!");

});
con.query("CREATE DATABASE IF NOT EXISTS bookstore", function (err, result) {  
        if (err) throw err;  
        console.log("Database created");  
 });  

var sql = "CREATE TABLE IF NOT EXISTS book ( name VARCHAR(255), Author VARCHAR(200), Publication VARCHAR(255), id INT , PRIMARY KEY(id))";  
con.query(sql, function (err, result) {  
    if (err) throw err;  
    console.log("Table created");  
 }); 
 /* con.query("INSERT INTO book  ( name, Author, Publication) VALUES ( 'THOUSAND','Khaleid','xyzpublsiher')",function(err,result){
    if (err) throw err;
    console.log("DATA INSERTED");
});*/
/*con.query("DELETE FROM book",function(err,result){
    if (err) throw err;
    console.log("DATA DELETED");
});*/
app.get('/',(req,res)=>{
    con.query("SELECT * FROM book",(err,rows)=>{
        if (err) throw err;
        res.render('bookindex',{
        title : 'WELCOME TO BOOK-IT',
        users : rows
        });
    });
});
app.get('/add',(req,res)=>{
    res.render('bookadd',{
        title: 'WELCOME TO BOOK-IT'
    });
});

app.post('/save',(req,res)=>{
    let data={  name:req.body.name, author:req.body.author, publication:req.body.publication};
    let sql="INSERT INTO book SET ?";
    let query=con.query(sql,data,(err,result)=>{
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/edit/:userId',(req,res)=>{
    const userId=req.params.userId;
    let  sql=`Select * FROM book where id= ${userId}`;
    let query=con.query(sql,(err,result)=>{
        if (err) throw err;
        res.render('bookedit',{
            title : 'WELCOME TO BOOK-IT',
            user : result[0]
            });
    
    });
});



 

app.post('/update',(req,res)=>{
    const userId=req.body.id;
    let sql = "UPDATE book SET name='"+req.body.name+"',  author='"+req.body.author+"',  publication='"+req.body.publication+"' where id =" +userId;
    let query = con.query(sql,(err, results) => {
    if (err) throw err;
        res.redirect('/');
    });
});
app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from book where id = ${userId}`;
    let query = con.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});
 

app.listen(3000,()=>{
    console.log('server is running');
});