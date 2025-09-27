/*
* @Author:  wangdongxue
* @Date:    2021-11-18 16:31:57
* effect ：卓乎浏览器批量收藏面板
*/
chrome.storage.local.get('showButton', function(items) {
	BathCollectionFn.CollectionObj(items.showButton);
	var dataLen = items.showButton;
});


var BathCollectionFn = {};
(function(){
	BathCollectionFn = {
		// 批量收藏
        CollectionObj(Aimg){
			chromeObj.loadingObj();
			var html = '';
            var imgData = [];
            var dataHtml = [];
			if($('.photos').length == 0){
                
                for(var i=0;i<Aimg.length;i++) {
                    var imgWidth = $(Aimg[i])[0].naturalWidth;
                    var imgHeight = $(Aimg[i])[0].naturalHeight;
                    if(imgWidth > 200 && imgHeight > 200){
                    　　var items=$(Aimg[i]).attr('src');
                    　　if($.inArray(items,imgData)==-1) {
                            dataHtml.push(Aimg[i]);
                    　　　　imgData.push(items);
							getImgBase64(Aimg[i][0].src);

                    　　}
                    }
                }
                html += '<div class="jq22-container"><div class="Wdx-collection-cont">\
                            <div class="wdx-title">\
								<a href="'+hrefUrl+'" target="_blank"><span class="tit-left"><i class="icon-zhuohu"></i>卓乎</span></a>\
								<div class="Chrome-Feedback">\
								<a href="https://wpa.qq.com/msgrd?v=3&uin=854260180&site=qq&menu=yes&jumpflag=1" target="_blank"><span class="wdx-yjfk"><i></i>意见反馈</span></a>\
									<div class="hov-cont">\
										<p class="code-title">卓乎内测用户反馈群</p>\
										<p class="code-text">(入群领取神秘福利)</p>\
										<p><img class="code-qq" src="/images/code/qq.png" alt=""></p>\
										<p class="code-txt">打开手机QQ，扫一扫</p>\
									</div>\
								</div><i class="i-but" id="top-off"></i>\
                            </div>\
                            <div class="WDX-common"><div class="photos">';
                            var dataLen = '';

                            if(dataHtml.length > 100){
                                dataLen = 100;
                            }else{
                                dataLen = dataHtml.length;
                            }
                            for (var i = 0; i < dataLen; i++) {
                                var text = $(dataHtml[i]).attr('title') || $(dataHtml[i]).attr('alt') || $('title').html();
                                var imgW = $(dataHtml[i])[0].naturalWidth;
                                var imgH = $(dataHtml[i])[0].naturalHeight;
                                var frUrl = $(dataHtml[i])[0].fromUrl;
								// console.log($(dataHtml[i]).attr('src').substring(0,4))
								try {
									var imghref = $(dataHtml[i]).attr('src').substring(0,4) == 'http' ? $(dataHtml[i]).attr('src') : ($(dataHtml[i]).attr('src').substring(0,4) == 'data' ? $(dataHtml[i]).attr('src') : 'https:'+$(dataHtml[i]).attr('src')); 
								} catch (error) {
									
								}
								
                                html += '<div class="photo">\
											<div class="img-posre wdx_img_click">\
												<span class="wdx-check js_wdx_check" data-url="'+frUrl+'"></span>\
												<img class="Upload-type" data-src="'+imghref+'" src="'+imghref+'">\
												<p class="img_err">图片加载失败，请右上角联系客服</p>\
												<span class="wdx-collection js_love_all">已收藏</span>\
												<div class="com-type list-load">\
													<div class="flex-center">\
														<span class="span-gif"></span>\
														<p class="text-loading">上传中</p>\
													</div>\
												</div>\
												<div class="com-type list-err">\
													<div class="flex-center">\
														<img class="img-gif" src="/images/err.png">\
														<p class="text-loading">收藏失败，<span class="js_txt_err">网络异常</span></p>\
													</div>\
												</div>\
												<div class="com-type list-suc">\
													<div class="flex-center">\
														<img class="img-gif" src="/images/succ.png">\
														<p class="text-loading">收藏成功，<a class="js_suc_href" target="_blank" href="'+hrefUrl+'/inspiration?id=">点击查看</a></p>\
													</div>\
												</div>\
											</div>\
											<div class="absou-Text">\
													<p class="img-size">'+imgW+' x '+imgH+'</p>\
													<p class="Text-inp js_plea_click"><span class="txt-cont">'+text+'</span></p>\
													<input class="input-plea" type="text" value="'+text+'">\
											</div>\
										</div>';

                            }
                    html += '</div></div>\
                            <div class="Fixed-com">\
                                <div class="Content-typ">\
                                    <a class="center-quantity"><span class="sp-numb">已选择 0张 </span>(最多20张)</a>\
                                    <div class="Fi-Table">\
                                        <button class="but-selec"><a class="rela-com js_button" data-type="1"><span class="clas-text" >待分类</span><i class="icon-arrow"></i></a></button>\
                                        <div class="div-nul-table"><button class="but-label js_button" data-type="2"><i class="icon-append-table"></i><span>添加标签</span><i class="table-num"></i></button></div>\
                                        <button class="but-all Js_Select_all js_button" data-type="3">全选</button>\
                                        <button class="but-col js_button" data-type="4">批量收藏</button>\
                                    </div>\
                                </div>\
                            </div>\
                        </div></div>';
                $('#WDX_imgFile').append(html);
				// <textarea class="Text-inp" style="display:none">'+text+'</textarea>\
				var hisSrc = localStorage.historyList;
				// console.log(hisSrc)
				if(hisSrc){
					if(hisSrc != 'null'){
						var historySrc = hisSrc.split(",");
						// console.log(historySrc)
						var imgCheck = $('.photos').find('img');
						for(var i = 0; i < historySrc.length;i++){
							for(var j = 0; j < imgCheck.length;j++){
								var imgSrc = $(imgCheck[j]).attr('src');
								if(historySrc[i] == imgSrc){
									$(imgCheck[j]).parent('.img-posre').find('.js_love_all').show();
								}
								
							}
						}
					}
				}
				$("img").error(function(){
					//当图片加载失败时，进行的操作
					$(this).attr("src","/images/default.png").siblings('.img_err').show();
				});
				setTimeout(function(){
					var imgCheck = $('.photos').find('img');
					chrome.storage.local.get(function(data){
						var dataArr = data.imgSign;
						if(dataArr != undefined){
							for(var i = 0;i < imgCheck.length;i++){
								for(var j = 1; j < dataArr.length;j++){
									if($(imgCheck)[i].src == dataArr[j].ImgUrl){
										$(imgCheck[i]).attr('data-type',dataArr[j].ossImg) 
									}
									
								}
							}
						}
					})
					$('.jq22-container .photos').css('opacity','1')
					chromeObj.loadingOffObj()
				},500)
            }
        },
    };
	$('body').keydown(function(even){
		if(even.keyCode == 27){
			EscTypeObjs(even)
		}
	
	})
	function EscTypeObjs(even){
		$('#top-off').trigger('click');
		even.preventDefault();
	}
	// window.addEventListener('resize', function(){
	// 	minigrid('.grid', '.grid-item');
	// });

	// 点击空白处关闭
	$(document).mouseup(function(e) {
		var _con = $('.Fi-Table'); // 设置目标区域
		if (!_con.is(e.target) && _con.has(e.target).length === 0) {
			$('.Cont-opac-all').remove();
			if($('.add-table').length > 0){
				$('.add-table').hide();
			}
		}
	});
	$('.wdx_img_click').on('click','js_suc_href',function(){
		ViewInspirationObj()
	})
	//  批量收藏查看灵感库统计
	function ViewInspirationObj(){
		console.log(189)
		var data = {
            type:'zhuohu_Inspiration_plug_inspiration_library_show',
        }
        chromeObj.BuryingPoint(data)
	}
	function getImgBase64(imgUrl) {
		window.URL = window.URL || window.webkitURL;
		var xhr = new XMLHttpRequest();
			var arry = [];
			xhr.open("get", imgUrl, true);
			// 至关重要
			xhr.responseType = "blob";
			xhr.onload = function () {
				if (this.status == 200) {
					//得到一个blob对象
					var blob = this.response;
					// 至关重要
					let oFileReader = new FileReader();
					oFileReader.onloadend = function (e) {
						let base64 = e.target.result;
						$('#WDX_imgBase').append('<img src="'+base64+'">')
					
					};
					oFileReader.readAsDataURL(blob);
				}
			}
			xhr.send();
		// }

	}
	
    // 批量收藏下面的分类操作
	$('body').on('click','.js_button',function(ev){
		// 1是待分类按钮  2是添加标签按钮 3是全选按钮  4是批量收藏按钮
		var _This = $(this);
		var typ = _This.attr('data-type');
		// if(!chromeObj.isLogin()){
		// 	chromeObj.goLoginObj();
		// 	return false;
		// }
		switch(typ){
			case '1':
				if($('.push-table').length == 0){
					chromeObj.loadingObj();
					TableHide();
					FnClassifiedObj(_This);
				}else{
					$('.push-table').remove();
				}
				// FNInputVal.inputFacousObj()
			break;
			case '2':
				FnAddLabelObj(_This);
				$('.push-table').remove();
			break;
			case '3':
				TableHide();
				FnSelectAllObj(_This);
				$('.push-table').remove();
			break;
			case '4':
				TableHide();
				FnColleObj(_This);
				$('.push-table').remove();
			break;
			default:
			break;
		}
	})
	// 待分类
	function FnClassifiedObj(_This){
		if(!chromeObj.isLogin()){
			chromeObj.loadingOffObj()
			chromeObj.goLoginObj();
			return false;
		}
		CollectionFn.classificationObj(_This,'1');
	}
	
	function TableHide(){
		if($('.add-table').length > 0){
			$('.add-table').hide();
		}
	}
    // 关闭采集窗口
	$('body').on('click','#top-off',function(){
		chrome.runtime.sendMessage('iframe');
		$('iframe').remove();
		$('.jq22-container').remove();
        // $('html').css('overflow', 'auto');
	});

    // 编辑图片的标题
    $('body').on('click','.Text-hove',function(){
		// $(this).attr('contenteditable',true);
	});
	
	// 选择需要采集的图片
	$('body').on('click','.wdx_img_click',function(){
		if($(this).find('.wdx-check').hasClass('wdx-check-active')){
			$(this).find('.wdx-check').removeClass('wdx-check-active');
		}else{
			if($('.jq22-container').find('.wdx-check-active').length >= 20){
				layer.msg('最多选择二十张图片');
			}else{
				if($(this).find('.Upload-type').hasClass('ImgType')){
				}else{
					$(this).find('.wdx-check').addClass('wdx-check-active');
				}
			}
		}
		CollectionQuantity();
	})
	// 批量采集图片
	$('body').on('click','.js_wdx_tity',function(){
		var leng = $('.jq22-container').find('.wdx-check-active').length;
		alert('您选中了'+leng+'张图片');
	})
	// 是否显示采集
	$('body').on('mouseenter','.photo', function (e) {
		$('.jq22-container').find('.js_wdx_check').hide();
        $('.jq22-container').find('.wdx-check-active').show();
		if($(this).find('.Upload-type').hasClass('ImgType')){
			$(this).find('.js_wdx_check').hide();
		}else{
			$(this).find('.js_wdx_check').show();
		}
	})
	$('body').on('mouseleave','.photo', function (e) {
		$('.jq22-container').find('.js_wdx_check').hide();
        $('.jq22-container').find('.wdx-check-active').show();
	})
	$('body').on('mouseenter','.js_plea_click', function (e) {
		$('.jq22-container').find('.js_plea_click').removeClass('Text-hove');
		$(this).addClass('Text-hove');
	})

	$('body').on('mouseleave','.js_plea_click', function (e) {
		$('.jq22-container').find('.js_plea_click').removeClass('Text-hove');
	})
	$('body').on('click','.js_plea_click',function(){
		$(this).hide().siblings('.input-plea').show().focus();
	})
	$('body').on('blur','.input-plea', function (e) {
		$(this).hide().siblings('.js_plea_click').show().find('.txt-cont').html($(this).val());
	})
    // input获取焦点 wdx-tarea
    // 回车添加标签
	$('body').on('keyup','.JS_add_laber', function (e) {
		if(e.which === 13) {
            if($(this).val().trim() != ''){
				// if($('.add-table .max-table').is(':hidden')){
					var dom = $('.tab-list').find('span');
					if(dom.length < 10){

						for (var i = 0; i < dom.length; i++){
							if($(this).val() === $(dom[i]).attr('data-lab')){
								$(this).val('');
								return false;
							}else{
							}
						}
						$(this).siblings('.tab-list').prepend('<span data-lab="'+$(this).val()+'">'+$(this).val()+'<i class="icon-tab-nul"></i></span>');
						$(this).val('');
					}else{
						$(this).val('');
						$('.add-table .max-table').show();
					}
						// }
                var len = $('.tab-list').find('span').length;
                
                $('.but-label').find('.table-num').html(len).show();
            }else{

            }
		}
	})
    // 删除标签
    $('body').on('click','.icon-tab-nul',function(){
		$(this).parent().remove();
        var len = $('.tab-list').find('span').length;
        $('.but-label').find('.table-num').html(len).show();
		$('.add-table .max-table').hide();
        if(len == 0){
            $('.div-nul-table .max-table,.table-num').hide();
        }
	})
    // 判断收藏了多少个
	function CollectionQuantity(){
		var leng = $('.jq22-container').find('.wdx-check-active').length;
		if(leng >0){
			$('.Js_Select_all').html('取消全选');
			$('.center-quantity').show().find('.sp-numb').html('已选择 '+leng+' 张');
		}else{
			$('.center-quantity').hide();
		}
	};
    // 全选
	function FnSelectAllObj(_This){
		var leng = $('.jq22-container').find('.wdx-check-active').length;
		if(leng == 0){
			for (i=0;i<=19;i++) {
				$('.jq22-container').find('.js_wdx_check').eq(i).addClass('wdx-check-active');
			}
			_This.html('取消全选');
		}else{
			$('.jq22-container').find('.js_wdx_check').removeClass('wdx-check-active');
			_This.html('全选');
		}
		CollectionQuantity();
	};
    // 添加标签
	function FnAddLabelObj(_this){
		var lab = $(_this).attr('data-lab');
		AddLabelHtml(_this);
		// chromeObj.loadingOffObj()
	}
	// 添加标签
	function AddLabelHtml(_this){
		var html = '';
		if($('.add-table').length == 0){
			html += '<div class="add-table">\
						<input class="inp-table JS_add_laber" type="text" placeholder="请输入标签，按回车键添加">\
                        <p class="max-table">*最多添加10个标签</p>\
						<div class="tab-list">\
						</div>\
					</div>'
			$(_this).parent().append(html);
		}else{
			if($('.add-table').is(':hidden')){
				$('.add-table').show();
			}else{
				$('.add-table').hide();
			}
		}
	}
	// 确认添加
	function ConfirmAddObj(_this){
		var len = $(_this).siblings().find('span').length;
		$('.add-table').hide();
		$(_this).attr('data-lab','3').find('span').html('修改标签');
	};
    // 批量收藏
	function FnColleObj(_This){
		var len = $('.jq22-container').find('.wdx-check-active');//选中的图片
		var lab = $('.tab-list').find('span');
		var clasId = $(_This).attr('data-id');
		// 标记oss
		var ossType = $('.jq22-container').find('.wdx-check-active').siblings('img').attr('data-type');
		var tags = [];
		var imgSrc = [];
		var fromUrl = '';
		if(!clasId){
			layer.msg('请先选择灵感集');
			return false;
		}
		for(var i = 0; i < lab.length; i++){
			tags[i] = $(lab[i]).attr('data-lab');
		}
		if(len.length == 0){
			layer.msg('请先选择图片');
			return false;
		}
		for(var i = 0; i < len.length; i++){
			$(len[i]).siblings('.list-load').show().siblings('.Upload-type').addClass('ImgType');
			imgSrc[i] = $(len[i]).siblings('img').attr('data-src');
			var forUrl = $(len[i]).attr('data-url');
			var fileName = $(len[i]).parent().siblings('.absou-Text').find('.input-plea').val()
			var insName = $('.rela-com.js_button').find('.clas-text').html() ;
			// 批量收藏  single
			chromeObj.toImg(imgSrc[i],fileName,forUrl,clasId,tags,insName,imgSrc,ossType,'Batch');
		}
		$('.js_wdx_check').removeClass('wdx-check-active').hide();
		$('.Js_Select_all ').html('全选');
		$('.js_button').find('.table-num').html('').hide();
		$('.tab-list').html('');
	}

})();