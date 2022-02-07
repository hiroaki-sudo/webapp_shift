const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended:true }));
router.use(cookieParser());

const connection = mysql.createConnection({
    host:'localhost',
    user:'yayano',
    password:'0109hiro',
    database:'db0',
    charset : 'utf8mb4'
});

connection.connect((err)=>{
    if(err){
	console.log('error connecting: '+err.stack);
	return;
    }
    console.log('mysql_login success');
});

router.post('/',(req,res) => {
    connection.query(
	"select * from shift_users where email='"+req.body.email+"';",
	(error,results)=>{
	    if(results.length==0){
		res.render('login_emailerr');
	    }
	    else if(results.length==1 && bcrypt.compareSync(req.body.password,results[0].hashed_password)){
		var l=10;
		var c="abcdefghijklmnopqrstuvwxyz0123456789";
		var cl=c.length;
		var token="";
		while(true){
		    for(var i=0;i<l;i++){
			token+=c[Math.floor(Math.random()*cl)];
		    }
		    if(token!="logouted"){
			break;
		    }
		}
		connection.query(
		    "update shift_users set token='"+token+"' where id="+results[0].id+";",
		    (err,resu)=>{
		    }
		);
		res.cookie('token',token,{httpOnly:true});
		res.cookie('name_id',results[0].id,{httpOnly:true});
		res.redirect('http://localhost:3000/my_page');
	    }
	    else{
		res.render('login_passworderr');
	    }
	}
    );
});

module.exports = router;
