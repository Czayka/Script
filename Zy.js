var modifiedHeaders = $request.headers;

let oldId = '1636c97d05b453yb65b451aa1424bab2';

let newId = changeStr(oldId,randomNum(0,oldId.length),randomNum(0,9))

modifiedHeaders['device-id'] = newId;

$done({headers : modifiedHeaders});


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
