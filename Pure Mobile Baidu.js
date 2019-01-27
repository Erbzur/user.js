// ==UserScript==
// @name			Pure Mobile Baidu
// @namespace		http://tampermonkey.net/
// @version			3.1
// @description		Purify the shitty baidu search page on mobile devices
// @author			Erbzur
// @include			*m.baidu.com*
// @grant			none
// ==/UserScript==

(function () {
	'use strict';
	const winHeight = window.innerHeight;
	const homepage = /m\.baidu\.com\/$|m\.baidu\.com\/\?/;
	const search = /\/s\?/;
	const url = window.location.href;
	const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	const observer = new MutationObserver(function (records) {
			purify();
		});
	observer.observe(document.body, {
		'childList': true,
		'subtree': true
	});
	purify();
	if (search.test(url)) {
		window.onload = redirect;
		const list = document.querySelectorAll('#results, #page-controller, .se-bn, .se-head-tablink, #page-relative');
		window.addEventListener('click', function (event) {
			for (let ele of list) {
				if (isChild(event.target, ele)) {
					event.stopPropagation();
					break;
				}
			}
		}, true);
	}

	function purify() {
		if (search.test(url)) {
			let rubbish = document.querySelectorAll('.page-banner, #page-tips, #results>div:not([order]), [class*="c-recomm-wrap"], [tpl="recommend_list"], [tpl="sigma_celebrity_rela"], [class*="ec_"]');
			for (let i = 0; i < rubbish.length; i++) {
				rubbish[i].remove();
			}
			try {
				document.querySelector('#page-ft').style.setProperty('display', 'none', 'important');
				document.querySelector('#page-copyright').style.setProperty('margin-bottom', '0px', 'important');
			} catch (e) {}
		} else if (homepage.test(url)) {
			let rubbish = document.querySelectorAll('.logined-banner, .first-card-container, .blank-frame');
			for (let i = 0; i < rubbish.length; i++) {
				rubbish[i].remove();
			}
			try {
				document.querySelector('#userinfo-wrap').style.setProperty('visibility', 'hidden');
				const header = document.querySelector('#header');
				const logo = document.querySelector('#logo');
				const foot = document.querySelector('#foot');
				logo.style.setProperty('margin-top', winHeight / 4 - logo.offsetHeight + 'px', 'important');
				foot.style.setProperty('margin-top', winHeight - header.offsetHeight - foot.offsetHeight + 'px', 'important');
			} catch (e) {}
			const whiteEles = document.querySelectorAll('#index-card, .navs-bottom-bar, #bottom');
			for (let i = 0; i < whiteEles.length; i++) {
				whiteEles[i].style.backgroundColor = 'white';
			}
		}
	}
	function redirect() {
		const reg = /https?([^']*)/;
		const results = document.querySelectorAll('#results>.c-result');
		for (let result of results) {
			const dataUrl = result.dataset.log.match(reg);
			const clickElements = result.querySelectorAll('a[href]');
			for (let ele of clickElements) {
				if (dataUrl) {
					ele.setAttribute('href', 'https' + dataUrl[1]);
				} else if (ele.dataset && ele.dataset.url) {
					ele.setAttribute('href', 'https' + ele.dataset.url.match(reg)[1]);
				}
			}
		}
	}
	function isChild(child, parent) {
		while (true) {
			if (child === parent) {
				return true;
			}
			if (child === document) {
				return false;
			}
			child = child.parentNode;
		}
	}
})();
