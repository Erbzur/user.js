// ==UserScript==
// @name			Pure Mobile Baidu
// @namespace		http://tampermonkey.net/
// @version			2.0
// @description		Purify the shitty baidu search page on mobile devices
// @author			Erbzur
// @include			*m.baidu.com*
// @grant			none
// ==/UserScript==

(function () {
	'use strict';
	const homepage = /(m\.baidu\.com\/$)|(m\.baidu\.com\/\?ref=)/;
	const search = /\/s\?/;
	function purify() {
		let url = window.location.href;
		if (search.test(url)) {
			let rubbish = document.querySelectorAll('.page-banner, #page-tips, #results>div:not([order]), [class*="c-recomm-wrap"], [tpl="recommend_list"], [class*="ec_"]');
			for (let i = 0; i < rubbish.length; i++) {
				rubbish[i].remove();
			}
			document.querySelector('#page-ft').style.setProperty('display', 'none', 'important');
			document.querySelector('#page-copyright').style.setProperty('margin-bottom', '0px', 'important');
		} else if (homepage.test(url)) {
			let rubbish = document.querySelectorAll('.logined-banner, .first-card-container, .blank-frame');
			for (let i = 0; i < rubbish.length; i++) {
				rubbish[i].remove();
			}
			document.querySelector('#logo').style.marginTop = screen.availHeight / 6 + 'px';
			const header = document.querySelector('#header');
			const foot = document.querySelector('#foot');
			foot.style.marginTop = screen.availHeight - header.offsetHeight - foot.offsetHeight + 'px';
			const whiteEles = document.querySelectorAll('#index-card, .navs-bottom-bar, #bottom');
			for (let i = 0; i < whiteEles.length; i++) {
				whiteEles[i].style.backgroundColor = 'white';
			}
		}
	}
	let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	const observer = new MutationObserver(function (records) {
			purify();
		});
	observer.observe(document.body, {
		'childList': true,
		'subtree': true
	});
})();
