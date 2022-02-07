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
    console.log('mysql_register success');
});

router.post('/',(req,res)=>{
    connection.query("select * from shift_users where email='"+req.body.email+"';",(err,result)=>{
	if(result.length!=0){
	    res.render('register_emailerr');
	}
	else {
	    connection.query("insert into shift_users(name,email,hashed_password) values('"+req.body.name+"','"+req.body.email+"','"+bcrypt.hashSync(req.body.password,10)+"');",(era,riza)=>{
		console.log(era);
	    });
	    res.render('register_user_complete');
	}
    });
});

module.exports = router;
