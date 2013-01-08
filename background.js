OSC = 'http://www.oschina.net';

// ajax get
function get(url, success) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            success(xhr.responseText);
        }
    };

    xhr.send();
}

// 显示通知
function show(content) {
    var notification = window.webkitNotifications.createNotification(
        'osc.png',
        '有消息了',
        content
    );

    // 点击打开首页
    notification.onclick = function () {
        chrome.tabs.create({url:OSC});
        this.cancel();
    }

    // 60秒自动关闭
    notification.ondisplay = function () {
        var temp = this;
        var fn = function () {
            temp.cancel();
        };
        window.setTimeout(fn, 60000);
    };


    notification.show();

}

// 请求首页
function checkAtMe() {
    console.log('checkAtMe....');

    get(OSC, function (html) {
        var msg = /\d+条新留言/.exec(html) || '';
        var at = /\d+条提到我/.exec(html) || '';

        if (at || msg) {
            show(msg + ' ' + at);
        }
        else {
            console.log('nothing....');
        }
    });
}

//=====================================================

window.addEventListener('load', function () {

    // 加载设置信息
    if (!localStorage.isInitialized) {
        localStorage.isActivated = true;
        localStorage.frequency = 1;
        localStorage.isInitialized = true;
    }

    // 立刻检查一次
    if (JSON.parse(localStorage.isActivated)) checkAtMe();

    // 间隔检查
    var interval = 0;
    setInterval(function () {
        interval++;
        if (JSON.parse(localStorage.isActivated)
            && localStorage.frequency <= interval) {
            checkAtMe();
            interval = 0;
        }
    }, 60000);

});