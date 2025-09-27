$('#page-off').on('click',function(){
    window.open('','_self');
    window.close();
})
var bg = chrome.extension.getBackgroundPage();
var UploadSrc  = bg.screenshot.imgSrc;
var UploadTit  = bg.screenshot.imgTitle;
var UploadHost = bg.screenshot.HostUrl;
var UploadType = bg.screenshot.scrType;
// scrType 1是自由选择  2是可视区域   3是全部区域

function photoshopInit(){
    $('.js_img_canv').attr('src',bg.screenshot.imgSrc)
    document.title = bg.screenshot.imgTitle;
    $('.js_look').attr('href',hrefUrl+'inspiration?id='+'');
}

$('.load-succ').on('click','.js_look',function(){
    // 截图收藏查看灵感集埋点
    console.log(1818)
    var data = {
        type:'zhuohu_Inspiration_plug_inspiration_library_show',
    }
    chromeObj.BuryingPoint(data)
    // var data = {
    //     type:'html',
    //     time:new Date(),
    //     id:$('.Top-user .User-name').attr('data-id')
    // }
    // chromeObj.BuryingPoint(DhajaxUrl+'navigation/add_bookmark',data)
})

// 保存到本地
$('.js_img_down').on('click',function(){
    var nam = document.title;
    var imgsrc = $('.js_img_canv').attr('src');
    const $a = document.createElement('a');
    $a.setAttribute("href", imgsrc);
    $a.setAttribute("download", nam);
    const event = new MouseEvent('click');
    $a.dispatchEvent(event);
})
// 收藏
$('.js_collection').on('click',function(){
    if($('.Cont-opac-all').is(':hidden')){
        $('.Cont-opac-all').show();
    }else{
        $('.Cont-opac-all').hide();
    }
})

// 收藏窗口的关闭按钮
$('.edit-fixed').on('click','.css-icon-off',function(){
    $('.push-table').hide();
})

// 添加收藏
$('#Tab-search').on('click','.css-selec',function(){
    var ThisId = $(this).attr('data-id');
    newAddIns(ThisId);

})
// 创建并添加按钮
$('.edit-fixed').on('click', '.JS_esta_add',function(){
    $(this).hide().siblings('.est-input').show().find('.Input').focus();
})
// 确认添加
$('.edit-fixed').on('click', '.JS_add_push',function(){
    var thisName = $(this).siblings('.Input').val();
    if(thisName != ''){
        insClassAdd(thisName);
        $('.rela-com.js_button').find('.clas-text').html(thisName);
    }else{
        layer.msg('请先输入名称');
    }
    $('.Cont-opac-all').hide().siblings('.load-type').show();
    $(this).siblings('.Input').val('');
    // UploadFn.UploadObj(dat);
})

//  回车添加灵感集
$('body').on('keyup','.est-input>.Input', function (e) {
    if(e.which === 13) {
        $('.est-input').find('.JS_add_push').trigger('click')
        e.preventDefault();

    }
})

// 联系客服
$('.push-table').on('click','.js_lxkf',function(){
    $(this).parent('.push-table').hide().siblings('.load-kf').show();
})
// 点击空白处关闭
$(document).mouseup(function(e) {
    var _con = $('.Cont-opac-all'); // 设置目标区域
    if (!_con.is(e.target) && _con.has(e.target).length === 0) {
        $('.Cont-opac-all').hide();
    }
});
$('body').keydown(function(even){
    if(even.keyCode == 27){
        EscTypeObj(even)
    }

})
function EscTypeObj(even){
    if($('.load-type').is(':hidden') && $('.load-err').is(':hidden') && $('.load-succ').is(':hidden')){ 
        $('#page-off').trigger('click');
    }else{
        $('.push-table').hide();
    }
    even.preventDefault();
}
// getTypeObj();
singleLoad()
// 获取分类
function singleLoad(_this){
    layui.use('flow', function(){
        var flow = layui.flow;
        flow.load({
            elem: '#Tab-search', //流加载容器
            scrollElem: '#Tab-search',
            done: function(page, next){ //执行下一页的回调
                // console.log(page)
                setTimeout(function(){
                    var paramObj = {
                        perPage:'20',
                        page:page
                    }
                    chromeObj.ajaxGet(ajaxUrl+"inspiration/class/get",paramObj,function(res){
                        if(res.code == 1){
                            searchInpHtml(res,page,next);
                            setTimeout(function(){
                                $('.Establish-comm').show().find('.setablish-bottom').hide().siblings('.est-but').show();
                            },20)
                            chromeObj.loadingOffObj()
                        }else if(res.code == 10001){
                            // chromeObj.goLoginObj();
                        }else{
                            chromeObj.loadingOffObj()
                            layer.msg(res.msg)
                        }
                    })
                },300);
            }
        });
    });
}

// function getTypeObj(){
//     var paramObj = {
//         page:'1'
//     }
//     chromeObj.ajaxGet(ajaxUrl+"inspiration/class/get",paramObj,function(res){
//         if(res.code == 1){
//             searchInpHtml(res);
//             setTimeout(function(){
//                 $('.Establish-comm').show().find('.setablish-bottom').hide().siblings('.est-but').show();
//             },20)
//         }else if(res.code == 10001){
//             chromeObj.goLoginObj();
//         }else{
//             layer.msg(res.msg)
//         }
//     })
// }
/**
 * 更新搜索框内容
 */
function searchInpHtml(res,perPage,next){
    var re = res.data.data;
    var html = '';
    for(var i = 0;i < re.length;i++){
        html += '<p class="css-line css-selec" data-id="'+re[i].class_id+'"><i class="icon-history"></i>'+re[i].class_name+'</p>';
    }
    next(html, perPage < Math.ceil(res.data.total/res.data.per_page));
    // $('#Tab-search').html(html);
};
autoSearch();

// 搜索功能
$("#inserter").on("propertychange input", function () { 
    if($(this).val().trim() == ''){
        searchValObj();
    }
});
// 搜索后的确认添加
$('.Establish-comm').on('click','.JS_sear_add',function(){
    var thisName = $(this).find('span').html();
    var typ = $(this).attr('data-type');
    if($(this).hasClass('js-activ')){
        layer.msg('请勿重复提交');
        return;
    }
    $(this).addClass('js-activ');
    insClassAdd(thisName,typ);
    $('.Cont-opac-all').hide().siblings('.load-type').show();
    $('.rela-com.js_button').find('.clas-text').html(thisName);
})

// 没有输入标签
function searchValObj(query){
    $('#Tab-search').html('');
    $('.Establish-comm').show().find('.setablish-bottom').hide().siblings('.est-but').show();
    singleLoad()
}
// 没有搜索到标签
function searchDomeObj(query){
    $('#Tab-search').html('');
    $('.Establish-comm').show().find('.setablish-bottom').show().find('.span').html(query).parent().siblings().hide();
}
// 搜索的内容展示
function WdoneObj(result,typ){
    var html = '';
    var dom = result.suggestions;
    var seaHtml = $('#inserter').val();
    dom.forEach(function (v, item, arr) {
        html += '<p class="css-line css-selec" data-id="'+v.value.class_id+'"><i class="icon-search-cont"></i>'+v.value.class_name+'</p>';
        if(seaHtml === v.value){
            $('.Establish-comm').hide();
        }else{
            // 此处延时是处理渲染的文字抓取到拼音
            setTimeout(function(){
                $('.Establish-comm').show().find('.setablish-bottom').show().find('.span').html(seaHtml).parent().siblings().hide();
            },20)
        }
    })
    $('#Tab-search').html(html);
}

// 搜索自动完成
function autoSearch(typ) {
    $('#inserter').autocomplete({
        lookup: function (query, done) {
            var result = {};
            if (query.trim() == '') {
                console.log(238)
                //没有输入内容的话就获取最近和热门数据
                // result.suggestions = getLocAndHots();
                // done(result);
            } else {
                //ajax获取服务器数据
                result.suggestions = [];
                baiduKeyAjax(query, function (data) {
                    var Adata = data.data;
                    if(Adata.length > 0){
                        Adata.forEach(function (v, item, arr) {
                            result.suggestions.push({
                                value: v,
                                data: item + ""
                            });
                        })
                        WdoneObj(result,typ);
                    }else{
                        searchDomeObj(query);
                    };
                });
            }

        },
        minChars: 0,
		zIndex: 999,
    });
};
/**
 * 模拟接口百度搜索关键字
 */
 function baiduKeyAjax(query, callbacks) {
    var dat = {
        k:query,
    };
    $.ajax({
        type: "get",
        url: ajaxUrl+'inspiration/class/search_tip',
        async: true,
        data: dat,
        dataType: 'json',
        success: function(res) {
            if(res.data!=undefined){
                callbacks(res);
            }
            
        },
        error: function(res) {
            callbacks(null);
        }
    });
}
function insClassAdd(thisName){
    var paramObj = {
        class_name:thisName,
    }
    var dataToekn = {
        token:encrypt.encrypt(JSON.stringify(paramObj))
    }
    chromeObj.ajaxPost(ajaxUrl+"inspiration/class/add",dataToekn,function(res){
        if(res.code == 1){
            var thisId = res.data;
            newAddIns(thisId,thisName);
            // $('.push-table').hide();
        }
    })
}
// 收藏灵感
function newAddIns(thisId,thsiName){
    console.log(264)
    var ImgUploadOss = {
        imgSrc : UploadSrc,
        title : UploadTit,
        fromUrl : UploadHost,
        classId : thisId,
        insName : thsiName,
        tags : [],
        arrLen:['']
    }
    // return false;
    $('.Cont-opac-all').hide().siblings('.load-type').show();
    chromeObj.toImg(ImgUploadOss)
    // chromeObj.toImg(imgSrc,title,fromUrl,classId,tags,insName,arrLen)
}
window.addEventListener('load', function() {
    photoshopInit();
})
