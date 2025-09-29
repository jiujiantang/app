function windHeight(){
    // 判断内容区域是一屏还是多屏  （1是一屏2是多屏）
	var domHei = document.body.clientWidth*1;
	var winHei = $(window)[0].innerWidth*1;
	var contHei = document.body.clientWidth;
	var comHei = document.body.clientHeight;
    if(domHei == winHei){
		if(contHei > comHei){
			var pageSize = '2';
		}else{
			var pageSize = '1';
		}
    }else{
        var pageSize = '2';
    }
    return pageSize
}

// 添加书签
function addBookMarkObj(){
	// console.log('添加书签快求解')
	var Aimg = $('body').find('img');
	var iframe = document.createElement('iframe'); 
	iframe.src= chrome.runtime.getURL('bookmark.html');
	iframe.id = 'Wdx_BookMarkId';
	iframe.style = 'width:216px;height:143px;position:fixed;top:10px;right:10px;border-radius: 4px;z-index:2147483647;border:0;display:block;';
	document.body.appendChild(iframe);
}
/**
 * 批量收藏方法
 */
var urlHost = window.location.host;
var FromUrl = window.location.href;
function imgListHtmlObj(){
	var Aimg = $('body').find('img');
	var iframe = document.createElement('iframe'); 
	iframe.src= chrome.runtime.getURL('imgfile.html');
	iframe.id = 'Wdx_iframeID';
	iframe.style = 'width:100%;height:100%;position:fixed;top:0;left:0;height:100%;z-index:2147483647;border:0;display:block;';
	document.body.appendChild(iframe);
	var MaximgSrc = '';
	if(FromUrl.match('https://www.zcool.com.cn/') != null){
		//站酷列表页面采集最大尺寸图片
		imgAllRules('zcool')
	}else if(FromUrl.match('www.om.cn/models/') != null){
		//欧模列表、搜索页面采集最大尺寸图片
		imgAllRules('om')
	}else if(FromUrl.match('www.om.cn/md/') != null){
		//欧模详情页面采集最大尺寸图片
		imgAllRules('omMd')
	}else if(FromUrl.match('www.tuozhe8.com/thread') != null){
		//括者8详情页面
		imgAllRules('tuozhe8')
	}else if(FromUrl.match('www.yinjispace.com/') != null){
		// 印际添加域名
		imgAllRules('yinjispace')
	}else if(FromUrl.match('www.pinterest.com/') != null){
		//pin网站
		imgAllRules('pinterest')
	}else if(FromUrl.match('www.behance.net/gallery') != null){
		//behance网站
		imgAllRules('behanceGallery')
		
	}else if(FromUrl.match('www.behance.net') != null){
		//behance网站
		imgAllRules('behance')
		
	}else{
		imgAllRules()
	}

	
}

function imgAllRules(imgMaxType){
	var data = [];
	// 注意，批量收藏的布局不是统一的加载大图会出现加载到其它的
	var Aimg = $('body').find('img');
	for (let i = 0; i < Aimg.length; i++) {
		switch (imgMaxType) {
			case 'zcool':
				var arrImgMax = $(Aimg[i]).attr('srcset') || $(Aimg[i]).attr('src') || $(Aimg[i]).attr('data-src')
					data[i] = [
						{
							"src": arrImgMax.replace(' 2x',''),
							// "src": $(Aimg[i]).attr('src') ,
							"title":$(Aimg[i]).attr('title') || $(Aimg[i]).attr('alt') || document.title, 
							"naturalWidth":$(Aimg[i])[0].naturalWidth,
							"naturalHeight":$(Aimg[i])[0].naturalHeight,
							"fromUrl":window.location.href
						},
					]
				break;
			case 'om':
				data[i] = [
					{
						"src": $(Aimg[i]).parents('li').attr('data-src') || $(Aimg[i]).attr('src') ,
						"title":$(Aimg[i]).attr('title') || $(Aimg[i]).attr('alt') || document.title, 
						"naturalWidth":$(Aimg[i])[0].naturalWidth,
						"naturalHeight":$(Aimg[i])[0].naturalHeight,
						"fromUrl":window.location.href
					},
				]
				break;
			case 'omMd':
				data[i] = [
					{
						"src": $(Aimg[i]).attr('src') ,
						"title":$(Aimg[i]).attr('title') || $(Aimg[i]).attr('alt') || document.title, 
						"naturalWidth":$(Aimg[i])[0].naturalWidth,
						"naturalHeight":$(Aimg[i])[0].naturalHeight,
						"fromUrl":window.location.href
					},
				]
				break;
			case 'tuozhe8':
				data[i] = [
					{
						"src": $(Aimg[i]).attr('src') ,
						"title":$(Aimg[i]).attr('title') || $(Aimg[i]).attr('alt') || document.title, 
						"naturalWidth":$(Aimg[i])[0].naturalWidth,
						"naturalHeight":$(Aimg[i])[0].naturalHeight,
						"fromUrl":window.location.href
					},
				]
				break;
			case 'yinjispace':
				data[i] = [
					{
						"src": 'https://www.yinjispace.com'+$(Aimg[i]).attr('src') ,
						"title":$(Aimg[i]).attr('title') || $(Aimg[i]).attr('alt') || document.title, 
						"naturalWidth":$(Aimg[i])[0].naturalWidth,
						"naturalHeight":$(Aimg[i])[0].naturalHeight,
						"fromUrl":window.location.href
					},
				]
				break;
			case 'pinterest':
				var MaximgSrc = '';
				var imgSrcSuc = $(Aimg[i]).attr('srcset');
				if(imgSrcSuc){
					MaximgSrc = $(Aimg[i]).attr('srcset').split(',').pop().replace(' 4x','');
				}else{
					MaximgSrc = $(Aimg[i]).attr('src');
				}
				data[i] = [
					{
						"src": MaximgSrc.replace(' ',''),
						"title":$(Aimg[i]).attr('title') || $(Aimg[i]).attr('alt') || document.title, 
						"naturalWidth":$(Aimg[i])[0].naturalWidth,
						"naturalHeight":$(Aimg[i])[0].naturalHeight,
						"fromUrl":window.location.href
					},
				]
				break;
			case 'behance':
				var MaximgSrc = '';
				var imgSrcSuc = $(Aimg[i]).attr('srcset');
					if(imgSrcSuc){
						try {
							MaximgSrc = $(Aimg[i]).attr('srcset').split(',').pop().split(' ')[1];
						} catch (error) {
							
						}
					}else{
						MaximgSrc = $(Aimg[i]).attr('src');
					}
					data[i] = [
						{
							"src": MaximgSrc,
							"title":$(Aimg[i]).attr('title') || $(Aimg[i]).attr('alt') || document.title, 
							"naturalWidth":$(Aimg[i])[0].naturalWidth,
							"naturalHeight":$(Aimg[i])[0].naturalHeight,
							"fromUrl":window.location.href
						},
					]
				break;
			case 'behanceGallery':
				var MaximgSrc = '';
				var imgSrcSuc = $(Aimg[i]).attr('srcset');
					if(imgSrcSuc){
						try {
							MaximgSrc = $(Aimg[i]).attr('srcset').split(',').pop().split(' ')[1];
						} catch (error) {
							
						}
					}else{
						MaximgSrc = $(Aimg[i]).attr('src');
					}
					data[i] = [
						{
							"src": MaximgSrc,
							"title":$(Aimg[i]).attr('title') || $(Aimg[i]).attr('alt') || document.title, 
							"naturalWidth":$(Aimg[i])[0].naturalWidth,
							"naturalHeight":$(Aimg[i])[0].naturalHeight,
							"fromUrl":window.location.href
						},
					]
				break;
			default:
				data[i] = [
					{
						"src": $(Aimg[i]).attr('src'),
						"title":$(Aimg[i]).attr('title') || $(Aimg[i]).attr('alt') || document.title, 
						"naturalWidth":$(Aimg[i])[0].naturalWidth,
						"naturalHeight":$(Aimg[i])[0].naturalHeight,
						"fromUrl":window.location.href
					},
				]
				break;
		}
		
	}
	chrome.storage.local.set({ showButton: data });

}