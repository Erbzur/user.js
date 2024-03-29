/* stop hijack */
(function() {
    'use strict';
    const watchlist = [
        'zhihu',
        'jianshu'
    ];
    let flag = false;
    for (let ele of watchlist) {
        if (location.hostname.indexOf(ele) !== -1) {
            flag = true;
        }
    }
    if (flag) {
        window.addEventListener('beforeunload', event => {
            const msg = '';
            try {
                event = event || window.event;
                event.preventDefault();
                event.returnValue = msg;
            } catch (e) {
                return msg;
            }
        });
    }
})();