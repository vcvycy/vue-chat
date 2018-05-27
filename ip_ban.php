<?php 
  //interface of Fullcalendar  
  define("jsonFile","ip_ban.json");
  define("status_success",'{"status":"success"}');
  define("status_failed",'{"status":"failed"}');
  function save_json($obj){
	$fp=fopen(jsonFile,"w");
	if (fp==NULL) return false;
	$data=json_encode($obj);
	fwrite($fp,$data);  
	fclose($fp);
	return true;
  }
  function addIP($item){  
    $item["time"]=time();
	$data=file_get_contents(jsonFile); 
	$obj=json_decode($data,true);
	$sz=count($obj);  
	$obj[$sz]=$item;
    return save_json($obj);
    
	return true;
  }
  function removeIP($ip){
	$data=file_get_contents(jsonFile);
	$obj=json_decode($data,true);
	$len=count($obj);
	for ($i=0;$i<$len;$i++){
	  if ($obj[$i]["ip"]==$ip){
        $tmp=$obj[$i];
        $obj[$i]=$obj[$len-1];
        $obj[$len-1]=$tmp; 
	    unset($obj[$len-1]);
	    return save_json($obj);
	  }
	}
	return false;
  }
  function qry($ip){
	$data=file_get_contents(jsonFile);
	$obj=json_decode($data,true);
	$len=count($obj);
	for ($i=0;$i<$len;$i++){
	  if ($obj[$i]["ip"]==$ip){ 
        return true;
	  }
	}
	return false;
  }
  $action=$_GET["action"]; 
  switch ($action){
    case "get":                                     // Get All Events
      $fp=file_get_contents("ip_ban.json","r"); 
      echo $fp;
      break;
    case "addIP":
      if (!isset($_GET["ip"]))die(status_failed);
	  $item=array();
	  $item["ip"]=$_GET["ip"];  
      if (addIP($item)) echo status_success;else echo status_failed;
      break;
	case "removeIP":
      if (!isset($_GET["ip"]))die(status_failed);
      if (removeIP($_GET["ip"]))echo status_success;else echo status_failed;
	  break;
    case "qry": 
      if (qry($_SERVER["REMOTE_ADDR"])) echo "1";else echo "0";
      break;
    default:
      echo status_failed;
  }

?>
