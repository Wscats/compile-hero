<?php
//百度地图ak key

//机器人接口的一个key
$apiKey = "c75ba576f50ddaa5fd2a87615d144ecf";
$apiURL = "http://www.tuling123.com/openapi/api?key=KEY&info=INFO";

// 设置报文头, 构建请求报文
header("Content-type: text/html; charset=utf-8");
//$reqInfo = "讲个笑话";
$reqInfo = $_GET["q"];
//$newUrl = str_replace("KEY", $apiKey, $apiURL);
//$url = str_replace("INFO", $reqInfo, $newUrl);
//http://www.tuling123.com/openapi/api?key=c75ba576f50ddaa5fd2a87615d144ecf&info=INFO
//string字符串 的replace替换
$url = str_replace("INFO", $reqInfo, str_replace("KEY", $apiKey, $apiURL));

$res = file_get_contents($url);
//echo $res;

//$q = $_GET["q"];
//$reqInfo = $_GET["q"];
//如果 q 大于 0，则查找数组中的所有提示

//$response = $res;
//echo $q;
//输出响应
echo $res;
?>