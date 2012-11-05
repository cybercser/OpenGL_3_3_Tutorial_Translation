function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }  
}
addLoadEvent(function(){
    var lhid = document.createElement('input');
    lhid.setAttribute('type','hidden');
    lhid.setAttribute('name','lang');
    lhid.setAttribute('value',icl_lang);     
    src = document.getElementById('searchform');   
    if(src){
        src.appendChild(lhid);
        src.action=icl_home; 
    }
});

function icl_retry_mtr(a){
    var id = a.getAttribute('id');
    spl = id.split('_');
    var loc = location.href.replace(/#(.*)$/,'').replace(/(&|\?)(retry_mtr)=([0-9]+)/g,'').replace(/&nonce=([0-9a-z]+)(&|$)/g,'');
    if(-1 == loc.indexOf('?')){
        url_glue='?';
    }else{
        url_glue='&';
    }    
    location.href=loc+url_glue+'retry_mtr='+spl[3]+'&nonce='+spl[4];
    return false;
}