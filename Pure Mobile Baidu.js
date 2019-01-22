// ==UserScript==
// @name			Pure Mobile Baidu
// @namespace		http://tampermonkey.net/
// @version			2.2
// @description		Purify the shitty baidu search page on mobile devices
// @author			Erbzur
// @include			*m.baidu.com*
// @grant			none
// ==/UserScript==

(function () {
	'use strict';
	const homepage = /(m\.baidu\.com\/$)|(m\.baidu\.com\/\?(ref|from)=)/;
	const search = /\/s\?/;
	const winHeight = window.innerHeight;
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
			document.querySelector('#userinfo-wrap').style.setProperty('visibility', 'hidden');
			document.body.style.setProperty('margin-bottom', 0 + 'px', 'important');
			const header = document.querySelector('#header');
			const logo = document.querySelector('#logo');
			const foot = document.querySelector('#foot');
			logo.style.setProperty('margin-top', winHeight / 4 - logo.offsetHeight + 'px', 'important');
			foot.style.setProperty('margin-top', winHeight - header.offsetHeight - foot.offsetHeight + 'px', 'important');
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
