
;
/**
 * 正常采集上传到oss 
 */
var titleImg,fromUrl,classId,tags,imgBase;


function getBase64(imgUrl,callback) {
	window.URL = window.URL || window.webkitURL;
	var xhr = new XMLHttpRequest();
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
            // imgBase = e.target.result;
            callback(base64);
		};
		oFileReader.readAsDataURL(blob);
	  }
	}
	xhr.send();
}

chromeObj.toImg =  function toImg(imgSrc,title,fromUrl,classId,tags,insName,arrLen,ossType,pointType) {
    $('.js_img_canv').attr('src',imgSrc);
    getBase64(imgSrc,function(Basedata){
        var Basedata = Basedata
        var _this = this;
        var image = new Image();
        titleImg = title;
        fromUrl = fromUrl;
        classId = classId;
        tags =tags;
        image.src = imgSrc;
        image.setAttribute("crossOrigin", "Anonymous");
        var xhr = new XMLHttpRequest();
        xhr.open('GET', imgSrc, true);    
        xhr.responseType = "blob";  // 返回类型blob
        xhr.onload = function () {
            if (this.status === 200) {
                // 获得二进制
                var blob = this.response;
                var reader = new FileReader();
                reader.onload = function (e) {
                    var spark = new SparkMD5.ArrayBuffer();
                    spark.append(e.target.result);
                    var md5Img = spark.end();
                    // var base64 = getBase64Image(image);
                    // _this.base64 = base64;
                    var formData = new FormData();
                    localStorage.historImgBase = insName;
                    var file = btof(Basedata, title,md5Img,imgSrc,fromUrl,classId,tags,insName,arrLen,ossType,pointType);
                    formData.append("imageName", file);
                }
                
                reader.readAsArrayBuffer(blob);
            }
        }
        xhr.send();
    });
    
   

}

function btof(Basedata, fileName,imgMd5,imgSrc,fromUrl,classId,tags,insName,arrLen,ossType,pointType) {
var fileObj = { //图片存放
        arr: [],
        size: 0
    },
    formObj = {}; //表单数据
        var dataArr = Basedata.split(",");
        var imgType = '' || 'jpg'
        if(imgSrc.match('.gif')){
            imgType = 'gif'
        }
        if(imgSrc.match('.png')){
            imgType = 'png'
        }
        if(imgSrc.match('.webp')){
            imgType = 'webp'
        }
        const byteString = atob(dataArr[1])
        const options = {
            type: "image/"+imgType,
            endings: "native"
        }
        const u8Arr = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i++) {
            u8Arr[i] = byteString.charCodeAt(i)
        }
        var getFlie = new File([u8Arr], fileName + "."+imgType, options);
        let imageUrl = window.URL.createObjectURL(getFlie);     
        if(ossType){
            var linkUrl= ossType;
            var domain = linkUrl.split('/'); 
            if (domain[2]) {
                domain = domain[0] + '//' + domain[2]; 
            }else{
                domain= '';
            }
            var ossImgSrc = ossType.replace(domain,'');
            InsinfoAdd(imgMd5,fileName,ossImgSrc,fromUrl,classId,tags,imgSrc,pointType);
            UploadFn.UploadObj(insName,Basedata,'100',arrLen);
        }else{
            percentCompleteFuncFiles(getFlie, fileName,imgMd5,imgSrc,fromUrl,classId,tags,insName,arrLen,pointType); //调用oss上传方法
        }
        return new File([u8Arr], fileName + ".jpg", options)   
        
    }
   /**
* oss 上传文件file
* @param {*} file 
*/
var imgSuccsign = [];
// chrome.storage.local.get(function(data){
//     var dataArr = data.imgSign;
//     imgSuccsigns1 = [];
//     if(dataArr != undefined){
//         for(var j = 1; j < dataArr.length;j++){
//             imgSuccsigns1 = [data.imgSign[j]]
//         }
//     }
// })

function percentCompleteFuncFiles(formObj, fileName, imgMd5,imgSrc,fromUrl,classId,tags,insName,arrLen,pointType) {
    var fileObjArr = [{
        key: 'zipfiles',
        file: formObj
    }];
    var fileObjSize = formObj.size;
    OssUpload.upload({
        url: ajaxUrl+'inspiration/info/get_upload_token',
        userPath: 'zhuohu/' + getYearMoth() + '/',
        fileArray: fileObjArr,
        totalSize: fileObjSize,
        progress: function (p) {
            // if($('#collection_html').length == 1){
            // }else{
            //     UploadFn.UploadObj(insName,Basedata,p,arrLen);
            // }
        },
        callBack: function (result) {
            
            var linkUrl= result[0].fileOssUrl;
            var domain = linkUrl.split('/'); 
            if (domain[2]) {
                domain = domain[0] + '//' + domain[2]; 
            }else{
                domain= '';
            }
            var ossImgSrc = result[0].fileOssUrl.replace(domain,'');

            InsinfoAdd(imgMd5,fileName,ossImgSrc,fromUrl,classId,tags,imgSrc,result[0].fileOssUrl,pointType);
        },
        error: function (e) {
            if($('#collection_html').length == 1){
                $('.load-type').hide().siblings('.load-err').show().find('.href-suc').html('网络异常');
                // chrome.runtime.sendMessage({uploadPage:'uploadPage',name:insName,imgUrl:imgSrc});
                // if(p == 100){
                    setTimeout(function(){
                        chrome.runtime.sendMessage('iframePage');
                    },500)
                // }
            }else{
                overUploadType(imgSrc,3);
                // UploadFn.UploadObj(insName,imgSrc,p,arrLen);
            }
        }
    })
}
function getYearMoth() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var mStr = (month < 10) ? ('0' + month) : (month + '');
    var mStrDay = (day < 10) ? ('0' + day) : (day + '');
    return date.getFullYear() + '' + mStr + '' + mStrDay;
}
var data = [localStorage.historyList] || [];
function InsinfoAdd(imgMd5,fileName,ossImg,fromUrl,classId,tags,imgSrc,ossUploadSucc,pointType){

    var paramObj = {
        	title:fileName.substring(0,50),
            from_url:fromUrl,
            img_url :ossImg,
            img_md5:imgMd5,
            tags:tags,
            class_id:classId,
        }
    
    chromeObj.ajaxPost(ajaxUrl+"inspiration/info/add",paramObj,function(res){
        if(res.code == 1){
            try {
                data.push(imgSrc);
            }catch(e) {
            }
            try {
                localStorage.historyList = data;
            }catch(e) {
                localStorage.historyList = '';
            }
            ossImgUploadSucc(ossUploadSucc,imgSrc)
            setTimeout(function(){
                chrome.runtime.sendMessage('iframePage');
            },5000)
            if($('#collection_html').length == 1){
                $('.load-type').hide().siblings('.load-succ').show().find('.js_look').attr('href',hrefUrl+'inspiration?id='+classId);
            }else{
                overUploadType(imgSrc,1,classId);
            }
            
            //  pointType = Batch 是批量收藏 ； 否则是单个收藏
            var data = {
                type: pointType == 'Batch' ? 'zhuohu_Inspiration_plug_batch_collection_collect' : 'zhuohu_Inspiration_plug_one_collection_collect',
                inspiration_class_id:classId,
                inspiration_id:res.data
            }
            chromeObj.BuryingPoint(data)
            
        }else if(res.code == 10001){
            if($('#collection_html').length == 1){
                $('.load-type').hide().siblings('.load-err').show().find('.href-suc').html('图片违规');
                // chrome.runtime.sendMessage({uploadPage:'uploadErr',imgUrl:imgSrc});
            }else{
                $('.wdx-Upload').remove();
                overUploadType(imgSrc,2);
                // chrome.runtime.sendMessage({uploadPage:'uploadErr',imgUrl:imgSrc});
                // UploadFn.UploadObj('',imgSrc);
            }
        }else{
            layer.msg(res.msg);
        }
    })
};
function overUploadType(imgSrc,typ,claId){
    //typ 1是成功  2是违规 3是网络异常
    var imgType = $('.WDX-common').find('.ImgType');
    for(var i = 0; i < imgType.length;i++){
        if(imgSrc == $(imgType[i]).attr('src')){
            switch(typ){
                case 1:
                    $(imgType[i]).siblings('.list-load').hide().siblings('.list-suc').show().find('.js_suc_href').attr('href',hrefUrl+'inspiration?id='+claId);
                    break;
                case 2:
                    $(imgType[i]).siblings('.list-load').hide().siblings('.list-err').show().find('.js_txt_err').html('图片违规');
                    break;
                case 3:
                    $(imgType[i]).siblings('.list-load').hide().siblings('.list-err').show().find('.js_txt_err').html('网络异常');
                    break;
                default:
                    break;
            }
        }
    }
}
function ossImgUploadSucc(ossUploadSucc,imgSrc){
    imgSuccsign.push({
        'ossImg':ossUploadSucc,
        'ImgUrl':imgSrc
    }
    )
    chrome.storage.local.set({ imgSign: imgSuccsign });
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
}

