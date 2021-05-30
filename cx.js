var modifiedUrl = $request.url;

let oldUrl = modifiedUrl;
let oldId = "2088112805292903"
let deviceId = "XD4VLeAqG3cDAEK3xhkw81Ac"
let newUrl = changeURLArg(oldUrl,"userId",changeStr(oldId,randomNum(0,oldId.length),randomNum(0,9)))
newUrl = changeURLArg(newUrl,"deviceId",changeStr(newUrl,randomNum(0,newUrl.length),randomNum(0,9)))

$done({url : newUrl});


function changeURLArg(url,arg,arg_val){
    var pattern=arg+'=([^&]*)';
    var replaceText=arg+'='+arg_val; 
    if(url.match(pattern)){
        var tmp='/('+ arg+'=)([^&]*)/gi';
        tmp=url.replace(eval(tmp),replaceText);
        return tmp;
    }else{ 
        if(url.match('[\?]')){ 
            return url+'&'+replaceText; 
        }else{ 
            return url+'?'+replaceText; 
        } 
    }
}


//生成从minNum到maxNum的随机数
function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
} 

function changeStr(str,index,changeStr){
	 return str.substr(0, index) + changeStr+ str.substr(index + 1 , str.length);
}
