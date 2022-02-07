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
    console.log('mysql_show_shift success');
});

router.get('/',(req,res)=>{
    connection.query(
	"select * from shift_users where id="+req.cookies.name_id+" and token='"+req.cookies.token+"'",
	(error,results)=>{
	    if(results.length==1){
		connection.query(
		    "select * from shift_inputs where delete_flag=0 order by shift_date asc;",
		    (err,resu)=>{
			if(resu.length==0){
			    res.render('no_such_input');
			}
			else{
			    var entire_s="";
			    for(var i=0;i<resu.length;i++){
				var s=resu[i].shift_date.toLocaleDateString()+","+resu[i].start_time+"~"+resu[i].end_time+","+resu[i].name;
				if(resu[i].comment!=""){
				    s+="@"+resu[i].comment;
				}
				s+="<br>";
				entire_s+=s;
			    }
			    res.render("show_shift",{message:entire_s});
			}
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
