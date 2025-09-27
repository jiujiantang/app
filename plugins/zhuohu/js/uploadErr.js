function getQueryVariable(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
var userName = localStorage.historImgBase;
var imgUrl = decodeURI(getQueryVariable('imgUrl'));
// var html = ''
$('.Upload-list').html('<i class="Up-off Js_uploadErr_off"></i>\
                        <a>\
                            <img class="Up-img" src="'+imgUrl+'" alt="">\
                            <p class="Up-title img-err-title">图片违规，禁止采集</span>”</p>\
                            <p class="Up-state Up-succ">请勿采集涉黄、涉恐暴、涉政等违法图片</p>\
                        </a>');
$('.Upload-list').on('click','.Js_uploadErr_off',function(){
    chrome.runtime.sendMessage('uploadErrPage');
})