const DDGC_SHARECODE='P04z54XCjVWnYaS5m9cZ2b5i38cwEawyPk_T7Q';
const JXGC_SHARECODE='woUSQ_yPOFrJB9dZ6MdwZQ==';
const ZD_SHARECODE='olmijoxgmjutzz4xm5rqyyocxme5zphvx455tfq';
const NC_SHARECODE='a3b56ca6636641f88222cef9762bf664';
const MC_SHARECODE='MTAxODExNTM5NDAwMDAwMDAzOTYwNTgwMw==';

const axios = require("axios");

//东东工厂提交分享码
function ddgc_upload_shareCode(){
    axios.get('http://api.turinglabs.net/api/v1/jd/ddfactory/create/'+DDGC_SHARECODE+'/')
    .then((response) => {
        console.log(response.data)
        $.beanerr =response.data
    })
    .catch(function(error) {
        console.log(error)
    })
}
