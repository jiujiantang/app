import $ from 'jquery';
import chromeObj from './chrome-function';

// 类型定义B!
interface ShortcutData {
    [key: string]: string;
}
// E！

// 默认快捷键设置
const defaultShortcuts: ShortcutData = {
    bookShortcut: "Alt+`",
    WBatchShortcut: "Alt+1",
    WSelectShortcut: "Alt+2",
    WCurrentShortcut: "Alt+3",
    WWholeShortcut: "Alt+4"
};

// 判断是否为 Mac 系统
function isMac(): boolean {
    return navigator.platform.match(/^mac/i) !== null;
}
// 获取符合操作系统的快捷键表示
function getOSFriendlyShortcut(string: string): string {
    if (isMac()) {
        return string.replace("Ctrl", "Control").replace("Meta", "Cmd");
    }
    return string;
}
// 初始化快捷键，获取本地存储或使用默认值
function initializeShortcuts(): ShortcutData {
    return {
        bookShortcut: localStorage.bookShortcut || defaultShortcuts.bookShortcut,
        WBatchShortcut: localStorage.WBatchShortcut || defaultShortcuts.WBatchShortcut,
        WSelectShortcut: localStorage.WSelectShortcut || defaultShortcuts.WSelectShortcut,
        WCurrentShortcut: localStorage.WCurrentShortcut || defaultShortcuts.WCurrentShortcut,
        WWholeShortcut: localStorage.WWholeShortcut || defaultShortcuts.WWholeShortcut
    };
}
// 将快捷键存储到本地存储和 Chrome 存储
function storeShortcutInLocalStorage(key: string, value: string): void {
    localStorage[key] = value;
    chrome.storage.local.set({ [key]: value });
}
// 快捷键开关的埋点函数
function toggleShortcutSwitch(status: number): void {
    chromeObj.BuryingPoint({
        type: 'zhuohu_Inspiration_plug_shortcut_key_click',
        switch_status: status
    });
}
// 处理快捷键开关按钮的点击事件
function handleTableClick($element: JQuery<HTMLElement>): void {
    let status = $element.hasClass('right-icon-active') ? '2' : '1';
    $element.toggleClass('right-icon-active')
        .attr('title', status === '1' ? '关闭' : '开启')
        .siblings('.off-txt')
        .show();

    chrome.storage.local.set({ ShortcutNameS: status });
    toggleShortcutSwitch(Number(status));
}
// 快捷键输入框的 keydown 事件处理
function handleShortcutKeydown($input: JQuery<HTMLElement>, event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const shortcut = getShortcut($input, event);
    if (!shortcut) return;

    const siblingInputs = $input.parents('.key-setting').siblings().find('input');
    for (let i = 0; i < siblingInputs.length; i++) {
        if ($(siblingInputs[i]).val() === shortcut) {// 此处是不允许重复输入，如果一样这置空
            setTimeout(() => {
                $input.val('');
                storeShortcutInLocalStorage($input.attr('id')!, "");
            }, 10);
        }
    }
}
// 从 keydown 事件中获取快捷键组合
function getShortcut($input: JQuery<HTMLElement>, event: KeyboardEvent): string {
    const modifiers: string[] = [];
    if (event.ctrlKey) modifiers.push("control");
    if (event.altKey) modifiers.push("alt");
    if (event.metaKey) modifiers.push("meta");
    if (event.shiftKey) modifiers.push("shift");

    let key = '';
    if (event.which < 32) return '';

    if (event.which === 32) key = 'Space';
    else if (event.which !== 16) key = event.key.toUpperCase();

    const shortcut = getOSFriendlyShortcut(modifiers.join("+")) + (key ? "+" + key : "");
    storeShortcutInLocalStorage($input.attr('id')!, shortcut);
    return shortcut;
}

// 快捷键设置和保存
export function initShortcutHandlers(): void {
    const shortcuts = initializeShortcuts();

    // 设置初始化值
    Object.keys(shortcuts).forEach(key => {
        $('#' + key).val(shortcuts[key]);
        chrome.storage.local.set({ [key]: shortcuts[key] });
    });

    // 快捷键开关切换
    $('.js_short').on('click', function () {
        handleTableClick($(this));
    });

    // 从存储中初始化快捷键开关状态
    chrome.storage.local.get('ShortcutNameS', function (obj: { ShortcutNameS: string }) {
        const status = obj.ShortcutNameS !== '2' ? '1' : '2';
        $('.js_short').toggleClass('right-icon-active', status === '1')
            .attr('title', status === '1' ? '关闭' : '开启');
        chrome.storage.local.set({ ShortcutNameS: status });
    });

    // 快捷键输入事件监听
    $('.key-input').keydown(function (event) {
        handleShortcutKeydown($(this), event);
    });
}
