/*
* @Author:  wangdongxue
* @Date:    2021-11-18 16:31:57
* effect ：卓乎浏览器收藏面板
*/

var CollectionFn = {};
(function(){
    CollectionFn = {
        // 收藏面板
        classificationObj(_this,ev){
            if(ev == 'search'){
                // 单个收藏
                singleLoad(_this)
            }else{
                if($('.push-table').length == 0){
                    searchInspInfo(ev,_this);
                    chromeObj.loadingOffObj()
                }
            }
            
        },
    };
    // 单个收藏
    function singleLoad(_this){
        layui.use('flow', function(){
            var flow = layui.flow;
            flow.load({
                elem: '#Tab-search', //流加载容器
                // mb: 100,
                scrollElem: '#Tab-search',
                done: function(page, next){ //执行下一页的回调
                    setTimeout(function(){
                        var paramObj = {
                            perPage:'20',
                            page:page
                        }
                        chromeObj.ajaxGet(ajaxUrl+"inspiration/class/get",paramObj,function(res){
                            // console.log(res)
                            if(res.code == 1){
                                searchInpHtml(_this,res,page,next);
                                chromeObj.loadingOffObj()
                            }else if(res.code == 10001){
                                chromeObj.goLoginObj();
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

    function searchInspInfo(ev,_this){
        var html = '';
        // var dat = res.data.data;
        var domeHe = $(window).height();
        var domeWi = $(window).width();

        if(ev == 1){
            // 1是批量收藏展示的
            html += '<div class="push-table Cont-opac-all">';
        }else{
            var evenY = (domeHe - ev.clientY);
            var evenX = (domeWi - ev.clientX);
            var leftX = (ev.clientX - $(document).scrollLeft());
            if(evenY > 400){
                // 此处是下方距离充足，判断右侧距离是否充足  需要计算左侧的（暂未计算）
                if(leftX > 300){
                    html += '<div class="push-table">';
                }else{
                    html += '<div class="push-table Cont-left">';
                }
            }else{
                // 下方距离不够统一展示在上方
                if(leftX > 300){
                    html += '<div class="push-table Cont-top-right">';
                }else{
                    html += '<div class="push-table Cont-top-left">';
                }
            }
        }
            html += '<p class="css-line css-title"><i class="css-icon-off"></i>添加至</p>\
                    <div class="hed-search"><input class="css-inp" id="inserter" type="text" placeholder="搜索灵感集"><i class="sea-icon-rem JS_search_rem"></i></div>\
                    <div class="css-cont" id="Tab-search">';
                        // <p class="css-line css-selec w-active"><i class="icon-history"></i>待分类</p>';
                        // for(var i = 0;i < dat.length;i++){
                        //     html += '<p class="css-line css-selec" data-id="'+dat[i].class_id+'" data-name="'+dat[i].class_name+'"><i class="icon-history"></i>'+dat[i].class_name+'</p>';
                        // }
                    html += '</div>\
                    <div class="Establish-comm">\
                        <div class="est-but JS_esta_add">'+(ev == '1' ? '创建灵感集' : '创建并添加')+'</div>\
                        <div class="est-input">\
                            <input class="Input" type="text" placeholder="输入灵感集名称">\
                            <button class="but-sub JS_add_push">'+(ev == '1' ? '创建' : '添加')+'</button>\
                        </div>\
                        <div class="est-but setablish-bottom JS_sear_add">'+(ev == '1' ? '创建 "<span class="span"></span>"灵感集' : '创建并添加 至 "<span class="span"></span>"灵感集')+'</div>\
                    </div>\
                </div>';
            $(_this).parent('.but-selec').append(html)
            singleLoad(_this)
    };
    /**
     * 更新搜索框内容
     */
     function searchInpHtml(page,res,perPage,next){
        var re = res.data.data;
        var html = '';
        if(page == 'page'){
            for(var i = 0;i < re.length;i++){
                html += '<p class="css-line css-selec" data-id="'+re[i].class_id+'" data-name="'+re[i].class_name+'" data-type="1"><i class="icon-history"></i>'+re[i].class_name+'</p>';
            }
        }else{
            for(var i = 0;i < re.length;i++){
                html += '<p class="css-line css-selec" data-id="'+re[i].class_id+'"><i class="icon-history"></i>'+re[i].class_name+'</p>';
            }
        }
        // $('#Tab-search').append(html);
        // $('#Tab-search').html(html);
        next(html, perPage < Math.ceil(res.data.total/res.data.per_page));

    };
    chromeObj.ajaxGet(ajaxUrl+"inspiration/class/get",{
        page:'1'
    },function(res){
        if(res.code == 1){
            $('.but-col.js_button').attr('data-id',res.data.data[0].class_id);
            $('.clas-text.js_button').html(res.data.data[0].class_name);
        }
    })
})()