<?php
$dbconf=array("host" => "localhost",
            "user" => "root",
            "pass" => "youpass",
            "dbname"=>"webim");
$s_conn=null;
function mydie($status,$data){
  $ret=array("status"=>$status,"data"=>$data);
  die(json_encode($ret,true));
}
function conn($dbconf){ 
  global $s_conn;
  $s_conn=new mysqli($dbconf["host"],$dbconf["user"],$dbconf["pass"],$dbconf["dbname"]);
  if ($s_conn->connect_error){
    mydie(-1,"conn error");
  } 
}
function insert($fromID,$toID,$content){ 
  global $s_conn;
  $content=mysqli_real_escape_string($s_conn,$content);
  $ip = $_SERVER["REMOTE_ADDR"]; 
  $now= time();
  $sql="insert into msg (fromID,toID,content,ip,time)
     values($fromID,$toID,'$content','$ip',$now);
     ";
  $rst=$s_conn->query($sql);
  if ($rst==false)
    mydie(-1,"query error");
  else
    mydie(0,"ins succ");
}
function query($id){
  global $s_conn;
  $sql="select * from msg where toID=$id and isRead=false";
  $rst=$s_conn -> query($sql);
  if ($rst==false) mydie(-1,"qry error");
  $data=$rst->fetch_all(); 
  //foreach($data as $item){
  for ($i=0;$i<count($data);$i++){
    $item=$data[$i];
    $url="http://ip.taobao.com/service/getIpInfo.php?ip=".$item[3];
    $city=json_decode(file_get_contents($url),true);
    $data[$i][]=$city["data"]["region"].$city["data"]["city"].$city["data"]["isp"];
    $sql="update msg set isRead=true where id=$item[0]";
    $rst=$s_conn->query($sql);
    if ($rst==false) mydie(-2,"unknow error"); 
  }
  mydie(0,$data);
}
//------------------------
$adminID=-123321;
conn($dbconf);
if (isset($_GET["action"])){
  switch($_GET["action"]){
    case "send": 
      $fromID=intval($_GET["fromID"]);   
      if (!isset($_GET["content"])) mydie(-4,"content null");
      if ($fromID>0){  //游客
        insert($fromID,$adminID,$_GET["content"]);
      }else
      if ($fromID==$adminID){
        insert($fromID,intval($_GET["toID"]),$_GET["content"]);
      }else
          mydie(-1,"?.?");
      break;
    case "query":
      if (isset($_GET["id"]))
          query(intval($_GET["id"]));
      break;
    default:
      mydie(-3,"未知指令");
  }
}
/*
echo "intval".intval("-123.32");
die("");
insert(1,2,"fdj".chr(0)."s--k");
query(2);*/
?>
