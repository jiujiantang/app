;
$(function(){
    // 添加书签
    const bookShortcut = localStorage.bookShortcut || "Alt+`";
    // 
    const WBatchShortcut = localStorage.WBatchShortcut || "Alt+1";
    const WSelectShortcut = localStorage.WSelectShortcut || "Alt+2";
    const WCurrentShortcut = localStorage.WCurrentShortcut || "Alt+3";
    const WWholeShortcut = localStorage.WWholeShortcut || "Alt+4";
    

    // 切换是否开启快捷键
    $('.js_short').on('click',function(){
        var _This = this;
        // if($(_This).hasClass('js-active')){
            TableClick(_This)
        // }else{
            // chromeObj.FnuserInfoObj(function(res){
            //     if(res.code == 10001){
            //         chromeObj.goLoginObj();
            //     }else{
            //         TableClick(_This)
            //     }
            // })
        // }
        // $(_This).addClass('js-active');
        
    })

    chrome.storage.local.get('ShortcutNameS', function(obj) {
        if(obj.ShortcutNameS != 2){
           $('.js_short').addClass('right-icon-active').attr('title','关闭');
            chrome.storage.local.set({ ShortcutNameS: '1'});
        }else{
            $('.js_short').removeClass('right-icon-active').attr('title','开启');
            chrome.storage.local.set({ ShortcutNameS: '2'});
        }
    });

    domeContent('bookShortcut',bookShortcut)
    domeContent('WBatchShortcut',WBatchShortcut)
    domeContent('WSelectShortcut',WSelectShortcut)
    domeContent('WCurrentShortcut',WCurrentShortcut)
    domeContent('WWholeShortcut',WWholeShortcut)
    
    chrome.storage.local.set({ bookShortcut: bookShortcut });
    chrome.storage.local.set({ WBatchShortcut: WBatchShortcut });
    chrome.storage.local.set({ WSelectShortcut: WSelectShortcut });
    chrome.storage.local.set({ WCurrentShortcut: WCurrentShortcut });
    chrome.storage.local.set({ WWholeShortcut: WWholeShortcut });
    // console.log(WBatchShortcut)
    function WShortcutFn(localUser,name){
        localStorage[localUser] =  name;
        chrome.storage.local.set({ [localUser]: name });
    }

    function domeContent(_This,name){
        $('#'+_This).val(name)
    }

    function TableClick(_This){
        var dat = '';
        // 1是关闭2是开启
        if(!$(_This).hasClass('right-icon-active')){
            $(_This).addClass('right-icon-active').attr('title','关闭');
            dat = '1'
        }else{
            $(_This).removeClass('right-icon-active').attr('title','开启');
            dat = '2'
        }
        $(_This).siblings('.off-txt').show();
        chrome.storage.local.set({ ShortcutNameS: dat});
        // 快捷键开关埋点
        ShortcutObj(dat)
    }

    // WShortcutFn('WSelectShortcut',"Alt+8")

    // 快捷键开关埋点
    function ShortcutObj(ThisId){
        var data = {
            type:'zhuohu_Inspiration_plug_shortcut_key_click',
            switch_status: ThisId == 1 ? 1 : 0
        }
        chromeObj.BuryingPoint(data)
    }
    //批量收藏输入框
    $('.key-input').keydown(function(event){
        processHotkey($(this), event);
    })
    function processHotkey(elem, event)
    {
        event.preventDefault();
        event.stopPropagation();
        
        var v = getShortcut(elem,event);
        if (v != ""){
            var Vdome = $(elem).parents('.key-setting').siblings().find('input');
            var tType = $(elem).attr('id');
            // 此处是不允许重复输入
            for (let i = 0; i < Vdome.length; i++) {
                elem.val(v.replace("/[/u0391-/uFFE5]/gi",''));
                if($(Vdome[i]).val() == v.replace("/[/u0391-/uFFE5]/gi",'')){
                    setTimeout(function(){
                        elem.val('');
                        WShortcutFn(tType,"")
                    },10)
                }else{
                }
            }
            
        }else{
            setTimeout(function(){
                // elem.val('');
            },10)
        }
    }

    function getShortcut(elem,event) 
    {
        var tType = $(elem).attr('id');

        var modifiers = [], key;        
        if (event.ctrlKey) modifiers.push("control");
        if (event.altKey) modifiers.push("alt");
        if (event.metaKey) modifiers.push("meta");
        if (event.shiftKey) modifiers.push("shift");
        modifiers = modifiers.join("+");
        
        if (modifiers == "" || event.which < 32) return "";

        var val = getOSFriendlyShortcut(modifiers.replace("alt", "Alt").replace("shift", "Shift").replace("control", "Ctrl").replace("meta", "Meta").replace("accel", "Ctrl")) + "+";
        if (event.which == 32) 
        key = "Space"; 
        else if(event.which == 16){
            key = "Space"; 
        }else{
            if(event.key.toUpperCase().length > 1){
                key = ''
            }else{
                key = event.key.toUpperCase()
            }
        } 
        if(key == ''){
            val = '';
        }else{
            val +=  key;
        }
        WShortcutFn(tType,val)

        return val;
    }
    function getOSFriendlyShortcut(string)
    {
        if (isMac())
            return string.replace("Ctrl", "Control").replace("Meta", "Cmd");
        else 
            return string;
    }
    function isMac()
    {
        return navigator.platform.match(/^mac/i) != null;
    }
    // getOption(cShortcutPrefVisible, cDefaultShortcutVisible)
    function getOption(optionName, defaultValue)
    {
        var val = localStorage[optionName];
        if (val == undefined) return defaultValue;
        else return val;
    }
});
