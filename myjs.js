var webim={}
webim.store=window.cjf.store;
webim.sessions=window.cjf.store.state.sessions;
webim.me={id:null}
webim.setUser=function(name,img){
  this.store.state.user.name=name;
  this.store.state.user.img=img;
}
webim.initFromLS=function(){  //init from local storage
    let data = localStorage.getItem('index_vue-chat-session'); 
    if (data) {
        s2=JSON.parse(data);
        while (webim.sessions.length>0) webim.sessions.pop();
        for (i=0;i<s2.length;i++){
            webim.sessions.push(s2[i]);
        } 
    }
} 
webim.init=function(){
   now=new Date(); 
};
webim.showMSG=function(toID,content,time,self){  
   let sess=this.sessions.find(item=>item.id == toID);  
   if (sess == undefined){ 
     sess={
       id:toID,
       user:{
         name:"临时用户"+toID,
         img:"dist/images/2.png"
         },
       messages:[]
     };
     webim.sessions.push(sess);  
   }
   sess.messages.push({
       content:content,
       date: new Date(parseInt(time)*1000),
       self:self});
       localStorage.setItem('index_vue-chat-session', JSON.stringify(webim.sessions));
}
webim.sendMSG=function(content,self=true){
    $.get("ip_ban.php",{'action':'qry'},function(data){
        if(data=="1") {
            setTimeout('alert("服务器繁忙，正在排队...")',500);
        }else{
           if (content.length==0 || content=="\n") return ;//alert("sendMSG");
           //alert("sendMSG"); 
           $.ajax({
              url:"./php/api.php",
              dataType:"json",
              data:{
                "action":"send",
                "fromID":webim.me.id,
                "content":content
              },
              success:function(data){
                if (data.status==0) {
                    webim.showMSG(window.cjf.store.state.currentSessionId,content,parseInt($.now()/1000),true);
                    $("#text").val("");
                }else 
                    alert("发送失败:"+data.data);
              }
           });
        }
    });
}
webim.recvMSG=function(){  //接受从别人发过来的
   $.ajax({
     url:"./php/api.php",
     dataType:"json",
     data:{
       "action":"query",
       "id":this.me.id
     },
     success:function(data){
       if (data.status==0){ 
           for(i=0;i<data.data.length;i++){
             item=data.data[i]; 
             webim.showMSG(item[1],item[6],item[4],false); 
           }
       }else
           alert("无法读取消息");
     }
   });
}
webim.getID=function() {
        if (localStorage.getItem("id")!=null)
            this.me.id= localStorage.getItem("id");
        else 
            this.me.id=Math.floor(Math.random()*9000+1000);  
        localStorage.setItem("id",this.me.id);
        
}
webim.initFromLS();
webim.getID();
webim.setUser("临时用户"+webim.me.id,"dist/images/1.jpg");
//webim.sendMSG(2,"to111111111111",true);