var webim={}
webim.store=window.cjf.store;
webim.sessions=window.cjf.store.state.sessions;
webim.me={id:null}; 
webim.setUser=function(name,img){
  this.store.state.user.name=name;
  this.store.state.user.img=img;
}
webim.getReply=function(){ 
    let data = localStorage.getItem('autoReply');  
    if(data==null || typeof(data)==undefined)
      return [];
    else  
      return JSON.parse(data);
}
webim.initFromLS=function(){  //init from local storage
    let data = localStorage.getItem('vue-chat-session'); 
    if (data) {
        s2=JSON.parse(data);
        while (webim.sessions.length>0) webim.sessions.pop();
        for (i=0;i<s2.length;i++){
            webim.sessions.push(s2[i]);
        } 
    }
} 
webim.storeToLS=function(){
   localStorage.setItem('vue-chat-session', JSON.stringify(webim.sessions));
}

webim.play=function(id){
   audio = document.getElementById(id);
   audio.play();
}
webim.removeSessID=function(id=null){
     if (id==null) id=window.cjf.store.state.currentSessionId;
     if (id==-123321) return; 
     idx=-1;
     for (i=0;i<webim.sessions.length;i++){
       if (parseInt(this.sessions[i].id)==parseInt(id))
         idx=i;
     }  
     if (idx==-1) return;
     webim.sessions.splice(idx,1);
     webim.storeToLS();
     window.cjf.store.state.currentSessionId=-123321;
   
}
webim.autoReply=function(fromID,content){
    while(content.length && (content[content.length-1]=='\n' || content[content.length-1]==' ')) content=content.substr(0,content.length-1);
    
    a=webim.getReply().find(item=>item[0]==content);
    
    if (a!=undefined)webim.sendMSG(a[1],false,fromID);
}
webim.init=function(){
   now=new Date(); 
};
webim.sendMSG=function(content,self=true,to=null){
   if (to==null) to=window.cjf.store.state.currentSessionId
   if (content.length==0 || content=="\n") return ;//alert("sendMSG"); 
   $.ajax({
      url:"./php/api.php",
      dataType:"json",
      data:{
        "action":"send",
        "fromID":this.me.id,
        "toID":to,
        "content":content
      },
      success:function(data){
        if (data.status==0) {
            webim.showMSG(to,content,parseInt($.now()/1000),true);
            $("#text").val("");
            webim.play("audio_send");
        }else 
            alert("发送失败:"+data.data);
      }
   });
}
webim.showMSG=function(toID,content,time,self,ip="",city=""){  
   let sess=this.sessions.find(item=>item.id == toID); 
   if (sess == undefined){  
     sess={
       id:toID,
       user:{
         name:"[IP"+ip+"]"+city,
         img:"dist/images/2.png"
         },
       messages:[]
     }; 
     webim.sessions.push(sess);  
   }
   //sess.user.name="【IP地址】"+ip;
   sess.messages.push({
       content:content,
       date: new Date(parseInt(time)*1000),
       self:self});
   localStorage.setItem('vue-chat-session', JSON.stringify(webim.sessions));
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
           if (data.data.length) webim.play("audio_recv");
           for(i=0;i<data.data.length;i++){
             item=data.data[i];  
             webim.showMSG(item[1],item[6],item[4],false,item[3],item[7]); //1:fromId,6:content,3:ip,7:ip_city 
             webim.autoReply(item[1],item[6]);
           }
           
       }else
           alert("无法读取消息");
     }
   });
}
webim.getID=function() { 
    this.me.id=-123321;
    return; 
}

webim.initFromLS();
webim.getID();
webim.setUser("管理员","dist/images/1.jpg");
//webim.sendMSG(2,"to111111111111",true);