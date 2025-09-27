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
var imgUrl = '';
// chrome.runtime.sendMessage({uploadPage:'GetImgBase64'},function(res){
    // if(res == ''){
        imgUrl = decodeURI(getQueryVariable('imgUrl'));
    // }else{
    //     imgUrl = res.collectPage[0].src
    // }
    $('.Upload-list').html('<i class="Up-off Js_upload_off"></i>\
        <a href="'+hrefUrl+'" target="_blank">\
            <img class="Up-img" src="'+imgUrl+'" alt="">\
            <p class="Up-title">收藏至“<span>'+userName+'</span>”</p>\
            <p class="Up-state Up-succ">点击这里，查看结果</p>\
        </a>');
        //  清空传参的图片
        // setTimeout(function(){
        //     chrome.runtime.sendMessage({uploadPage:'GetImgBaseNull'})
        // },3000)
// })
// var html = ''

$('.Upload-list').on('click','.Js_upload_off',function(){
    chrome.runtime.sendMessage('uploadPageOff');
})