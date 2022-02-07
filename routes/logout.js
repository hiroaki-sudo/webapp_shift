const express = require('express');
const mysql = require('mysql');
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
    console.log('mysql_logout success');
});

router.get('/',(req,res)=>{
    connection.query(
	"select * from shift_users where id="+req.cookies.name_id+" and token='"+req.cookies.token+"'",
	(error,results)=>{
	    if(results.length==1){
		connection.query(
		    "update shift_users set token='logouted' where id="+req.cookies.name_id+";",
		    (err,resu)=>{
			res.redirect('/home');
		    }
		);
	    }
	    else{
		res.render('no_token');
	    }
	}
    );
});

module.exports = router;
