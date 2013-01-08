window.addEventListener('load', function () {
    // 加载已有设置
    options.isActivated.checked = JSON.parse(localStorage.isActivated);
    options.frequency.value = localStorage.frequency;

    if (!options.isActivated.checked) ghost(true);

    options.isActivated.onchange = function () {
        localStorage.isActivated = options.isActivated.checked;
        ghost(!options.isActivated.checked);
    };

    options.frequency.onchange = function () {
        localStorage.frequency = options.frequency.value;
    };

    // 链接
    $('a[href]').each(function (i, n) {
        $(this).click(function () {
            chrome.tabs.create({url:$(this).attr('href')});
        });
    });
});

// 设置表单状态, 不可用时置灰
function ghost(isDeactivated) {
    options.style.color = isDeactivated ? 'graytext' : 'black';
    options.frequency.disabled = isDeactivated;
}