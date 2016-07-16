<?php
	//拿到前端传过来的值
    //$input = $_GET['input'];
	$url = "localhost:3306";
	$user = "wsscats";
	$psw = "123456789";
	//这个连接数据库的方法，第一个传数据库所在的服务器名，第二个传用户名，第三个传密码
	$conn = mysql_connect($url,$user,$psw);
	if(!$conn){
		//echo "连接不成功";
	}else{
		//echo "连接成功";
		//echo $conn;
	}
	//选择数据库里面的suibian这个库
	mysql_select_db('suibian');
	//select from 
	//where
	
	$sql = "SELECT * FROM `class1602`";
	//js字符串连接是用+ php连接字符串是用.
	$sql1 = "INSERT INTO class1602 VALUES ('Gates1', '.".$input.".')";
	//insert 
	//我们用SQL的语句来执行查找数据
	$retval = mysql_query($sql1, $conn);
	//对象数组
	//var_dump($retval);
	//数据处理
	//$row = mysql_fetch_array($retval,MYSQL_ASSOC);
	echo $row['mobile'];
	//var_dump($row);
	
	?>