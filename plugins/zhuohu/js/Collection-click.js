
$(function(){
	function inputFacousObj(){
		var typ = $("#inserter").attr('data-type');
		if(typ == 1){
			autoSearch(1);
		}else{
			autoSearch();
		}
	}
	// 判断是否登录
	chromeObj.FnuserInfoObj(function(res){
		if(res.code == 10001){
			chromeObj.goLoginObj();
		}
	})

	// esc关闭
	$('body').keydown(function(even){
		if(even.keyCode == 27){
			$('#top-off').trigger('click');
			even.preventDefault();
		}
	
	})

	inputFacousObj()
	
    /**
	 * 单个收藏功能
	 */
	// 创建并添加按钮
	$('body').on('click', '.JS_esta_add',function(){
		$(this).hide().siblings('.est-input').show().find('.Input').focus();
	})
	// 确认添加
	$('body').on('click', '.JS_add_push',function(){

		var thisName = $(this).siblings('.Input').val();
		var typ = $(this).attr('data-type');
		if(thisName != ''){
			insClassAdd(thisName,typ);
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
	// 搜索后的确认添加
	$('body').on('click','.JS_sear_add',function(){
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
	// 删除搜索输入框内容
	$('body').on('click', '.JS_search_rem',function(){
		$(this).siblings('input').val('');
		$('.est-but').hide();
		$('.JS_esta_add').show();
	})
	// 联系客服
	$('#collection_html').on('click','.js_lxkf',function(){
		$(this).parent('.push-table').hide().siblings('.load-kf').show();
	})
	/**
	 * 单个收藏功能end
	 */

	// 选中灵感集
	$('body').on('click','#Tab-search .css-selec',function(){
		var typ = $(this).attr('data-type');
		var thisId = $(this).attr('data-id');
		if(typ == '1'){
			// 1是单个收藏的上传
			if($(this).hasClass('active')){
				layer.msg('请勿频繁操作');
			}else{
				var thisName = $(this).attr('data-name');
				$('.Cont-opac-all').hide().siblings('.load-type').show();
				chrome.storage.local.get('collectPage', function(items) {
					newAddIns(items,thisId,thisName);
				});
					
				
			}
			$(this).addClass('active');
			setTimeout(function(){
				$(this).removeClass('active');
			},1000)
		}else{
			checkInspra(this)
		}
	})
	 // 收藏窗口的关闭按钮
	 $('body').on('click','.css-icon-off',function(){
		$('.push-table').remove();
		chrome.runtime.sendMessage('iframePage');
	})

	$('.load-succ').on('click','.js_look',function(){
		$('.push-table').remove();
		chrome.runtime.sendMessage('iframePage');

		// 单个收藏查看灵感集埋点
		var data = {
            type:'zhuohu_Inspiration_plug_inspiration_library_show',
        }
        chromeObj.BuryingPoint(data)
		// var data = {
        //     type:html,
        //     time:new Date(),
        //     id:$('.Top-user .User-name').attr('data-id')
        // }
        // chromeObj.BuryingPoint(DhajaxUrl+'navigation/add_bookmark',data)
	})
	
    // 搜索功能
	$('body').on('focus','#inserter',function(){
		var typ = $("#inserter").attr('data-type');
		if(typ == 1){
			autoSearch(1);
		}else{
			autoSearch();
		}
		// 1是单个页面收藏
	})
	$("body").on("propertychange input", "#inserter", function () { 
		var typ = $("#inserter").attr('data-type');
		// 1是单个页面收藏
		if($(this).val().trim() == ''){
			setTimeout(function(){
				$('.JS_sear_add').hide().siblings('.JS_esta_add').show();
				// $('.Establish-comm').show().find('.setablish-bottom').hide().siblings('.est-but').show();
			},30)
		}else{
		}
	});
	
	// 收藏灵感
	function newAddIns(res,thisId,thsiName){
		var reData = res.collectPage[0];
		// console.log(reData)
		var imgSrc,title,fromUrl,classId,tags,insName;
		var arrLen = [''];
		imgSrc = reData.src.substring(0,4)== 'http' ? reData.src : (reData.src.substring(0,4) == 'data' ? reData.src : 'https:'+reData.src);
		title = reData.title;
		fromUrl = reData.fromUrl;
		classId = thisId;
		insName = thsiName;
		tags = [];
		// return false;
		chromeObj.toImg(imgSrc,title,fromUrl,classId,tags,insName,arrLen)
	}
	function insClassAdd(thisName,typ){
		var paramObj = {
            class_name:thisName,
        }
        var dataToekn = {
            token:encrypt.encrypt(JSON.stringify(paramObj))
        }
		chromeObj.ajaxPost(ajaxUrl+"inspiration/class/add",dataToekn,function(res){
			if(res.code == 1){
				var thisId = res.data;
				if(typ == 'page'){
					chrome.storage.local.get('collectPage', function(items) {
						newAddIns(items,thisId,thisName);
					});
				}else{
					$('.push-table').remove();
					$('.but-col.js_button').attr({'data-id':thisId})
				}
			}
        })
	}
	function checkInspra(_This){
		var thisId = $(_This).attr('data-id') || '';
		var thisName = $(_This).attr('data-name') || '待分类';
		$('.js_button').find('.clas-text').html(thisName);
		$('.push-table').remove();
		$('.but-col.js_button').attr({'data-id':thisId})
	}
    // 搜索的内容展示
	function WdoneObj(result,typ){
		var html = '';
		var dom = result.suggestions;
		var seaHtml = $('#inserter').val();
		dom.forEach(function (v, item, arr) {
			if(typ == 1){
				html += '<p class="css-line css-selec" data-id="'+v.value.class_id+'" data-name="'+v.value.class_name+'" data-type="1"><i class="icon-search-cont"></i>'+v.value.class_name+'</p>';
			}else{
				html += '<p class="css-line css-selec" data-id="'+v.value.class_id+'"><i class="icon-search-cont"></i>'+v.value.class_name+'</p>';
			}
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
	// 没有标签
	function searchDomeObj(query){
		$('#Tab-search').html('');
		if($('#inserter').val() == ''){
			$('.JS_sear_add').hide().siblings('.JS_esta_add').show();
		}else{
			$('.Establish-comm').show().find('.setablish-bottom').show().find('.span').html(query).parent().siblings().hide();
		}
	}
	
	// 搜索自动完成
	function autoSearch(typ) {
		$('#inserter').autocomplete({
			lookup: function (query, done) {
				var result = {};
				if (query.trim() == '') {
					// console.log(query)
						// CollectionFn.classificationObj('page','search');
					//没有输入内容的话就获取最近和热门数据
					// result.suggestions = getLocAndHots();
					// done(result);
				} else {
					//ajax获取服务器数据
					result.suggestions = [];
					baiduKeyAjaxInp(query, function (data) {
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
			onSearchStart: function(param) {
				// console.log(param)
			},
			minChars: 0,
			zIndex: 999,
			
		});
	};
	/**
	 * 模拟接口百度搜索关键字
	 */
	 function baiduKeyAjaxInp(query, callbacks) {
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
})