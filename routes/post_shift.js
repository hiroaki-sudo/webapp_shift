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
    console.log('mysql_post_shift success');
});

router.post('/',(req,res)=>{
    console.log("select * from shift_users where id="+req.cookies.name_id+" and token='"+req.cookies.token+"' and delete_flag=0;");
    connection.query(
	"select * from shift_users where id="+req.cookies.name_id+" and token='"+req.cookies.token+"' and delete_flag=0;",
	(error,results)=>{
	    console.log(error);
	    if(results.length==1){
		connection.query(
		    "update shift_inputs set delete_flag=1 where shift_date='"+req.body.date1+"' and name_id="+req.cookies.name_id+";",
		    (err,resu)=>{
		    }
		);
		connection.query(
		    "insert into shift_inputs(shift_date,start_time,end_time,name_id,name,comment) select '"+req.body.date1+"','"+req.body.in_time+"','"+req.body.out_time+"',"+req.cookies.name_id+",name,'"+req.body.comment+"' from shift_users where id="+req.cookies.name_id+";",
		    (err,resu)=>{
			res.render("post_shift_complete",{admin_flag:results[0].admin_flag});
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
