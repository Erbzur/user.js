// ==UserScript==
// @name			Pure Mobile Baidu
// @version			1.5
// @description		Purify the shitty baidu search page on mobile devices
// @editor			Erbzur
// @include			*m.baidu.com*
// @run-at			document-start
// ==/UserScript==

(function() {

    function purify() {
        $('#index-card>div:not(#header):not(#bottom), .logined-banner, #header>#navs~*, #page-tips, #results>div:not([order]), [class*="c-recomm-wrap"], [tpl="recommend_list"], [class*="ec_"], .page-banner').remove();
        $('#page-ft').css({
            display: "none !important"
        });
        $('#page-copyright').css({
            marginBottom: "0px !important"
        });
    }

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function(records) {
        purify();
    });
    var option = {
        'childList': true,
        'subtree': true
    };

    document.onreadystatechange = function() {
        if (document.readyState == "interactive") {
            observer.observe(document.body, option);
        }
    };

    purify();
})();