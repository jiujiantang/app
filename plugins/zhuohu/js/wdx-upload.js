/*
* @Author:  wangdongxue
* @Date:    2021-11-22 15:31:57
* effect ：卓乎浏览器上传状态
*/

var UploadFn = {};
(function(){
    UploadFn = {
        UploadObj(dat,imgSrc,lod,arrLen){
            // console.log(dat)
            if(dat == ''){
                uploadStateErr(imgSrc);
            }else{
                uploadState(dat,imgSrc,lod,arrLen);
            }
        },
    };
    $('body').on('click','.Js_upload_off',function(){
        $('.wdx-Upload').remove();
    })
    // uploadState();
    // 上传状态
    var arryObj = 0;
    function uploadState(dat,imgSrc,lod,arrLen){
        var html = '';
            // <p class="Up-state Up-err">操作失败，请点击重试</p>\
        html += '<div class="wdx-Upload js_succ_load">\
                    <ul class="Upload-common">\
                        <li class="Upload-list">\
                            <i class="Up-off Js_upload_off"></i>\
                            <img class="Up-img" src="'+imgSrc+'" alt="">\
                            <p class="Up-title">收藏至“<span>'+dat+'</span>”</p>\
                            <p class="Up-load"><i class="Up-load-aft" style="width:'+lod+'%;"></i></p>\
                        </li>\
                    </ul>\
                </div>';
            if($('#collection_html').length == 1){
                // chrome.runtime.sendMessage('uploadPage');
                chrome.runtime.sendMessage('iframePage');
            }else{  //单个收藏新开页面、状态无法实时获取 
                $('body').append(html);
                if(lod == 100){
                    setTimeout(function(){
                        arryObj++;
                        if(arryObj == arrLen.length){
                            html += '<div class="wdx-Upload js_succ_load">\
                            <ul class="Upload-common">\
                            <li class="Upload-list">\
                            <i class="Up-off Js_upload_off"></i>\
                            <img class="Up-img" src="'+imgSrc+'" alt="">\
                            <p class="Up-title">收藏至“<span>'+dat+'</span>”</p>\
                            <p class="Up-state Up-succ"><a href="'+hrefUrl+'" target="_blank">点击这里，查看结果</a></p>\
                            </li>\
                            </ul>\
                            </div>';
                            $('body').append(html);
                            setTimeout(function(){
                                if($('#collection_html').length == 1){
                                    chrome.runtime.sendMessage('iframePage');
                                }else{
                                    $('.js_succ_load').remove()
                                }
                            },5000)
                            arryObj = 0;

                        }else if(arryObj < arrLen.length){
                            $('.js_succ_load').remove().find('.Up-load-aft').css('width','0');
                            if($('#collection_html').length == 1){
                                chrome.runtime.sendMessage('iframePage');
                            }
                        }else{
                            arryObj = 0;
                        }
                    },200)       
                }
            }
        
    };
    $('#WDX_upload_Err').on('click','.Js_img_err',function(){
        $(this).parent('.Upload-list-err').remove();
    })
    function uploadStateErr(imgSrc){
        // var html = '';
        // $('#WDX_upload_Err').append('<img class="Up-img" src="'+imgSrc+'" alt="">')
        $('#WDX_upload_Err').append('<li class="Upload-list Upload-list-err">\
                <i class="Up-off Js_img_err"></i>\
                 <img class="Up-img" src="'+imgSrc+'" alt="">\
                 <p class="Up-title img-err-title">图片违规，禁止采集</span>”</p>\
                 <p class="Up-state Up-succ">请勿采集涉黄、涉恐暴、涉政等违法图片</p>\
            </li>')
        // $('#WDX_upload_Err').append('<div class="wdx-Upload">\
        //         <ul class="Upload-common"><li class="Upload-list Upload-list-err">\
        //         <i class="Up-off Js_upload_off"></i>\
        //         <img class="Up-img" src="'+imgSrc+'" alt="">\
        //         <p class="Up-title img-err-title">图片违规，禁止采集</span>”</p>\
        //         <p class="Up-state Up-succ">请勿采集涉黄、涉恐暴、涉政等违法图片</p>\
        //     </li></ul>\
        //     </div>')
                    // console.log(imgSrc)
        // for (var i = 0 ;i < thisDome;i++){
        //     console.log(imgSrc)
        //     html += '<div class="wdx-Upload '+thisDome+'">\
        //             <ul class="Upload-common">';
        //     html += '<li class="Upload-list Upload-list-err">\
        //             <i class="Up-off Js_upload_off"></i>\
        //             <img class="Up-img" src="'+imgSrc+'" alt="">\
        //             <p class="Up-title img-err-title">图片违规，禁止采集</span>”</p>\
        //             <p class="Up-state Up-succ">请勿采集涉黄、涉恐暴、涉政等违法图片</p>\
        //         </li>';
        //     // console.log(thisDome)
        //     html += '</ul>\
        //         </div>';
        //     // $('#WDX_upload_Err').append(html);
        // }
        
        
        
    }

})();