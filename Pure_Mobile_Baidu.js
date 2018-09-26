// ==UserScript==
// @name			Pure_Mobile_Baidu
// @version			1.1
// @description		Purify the shitty baidu search page on mobile devices
// @author			Erbzur
// @include			*m.baidu.com*
// ==/UserScript==

function purify() {
    $('#index-card>div:not(#header):not(#bottom), .logined-banner, #header>#navs~*, #page-tips, #results>div:not([order]), [class*="c-recomm-wrap"], [tpl="recommend_list"], [class*="ec_"], #page-ft, .page-banner').remove();
    $('#page-copyright').css({
        marginBottom: "0px !important"
    });
    $('.new-firstpage, .new-prepage, .new-nextpage, .new-nextpage-only').on('click', function() {
        location.replace(this.href);
    });
}
purify();