// ==UserScript==
// @name			Pure Mobile Baidu
// @namespace			http://tampermonkey.net/
// @version			3.4
// @description			Purify the shitty baidu search page on mobile devices
// @author			Erbzur
// @include			*m.baidu.com*
// @grant			none
// ==/UserScript==

(function() {
	'use strict';
	const homepage = /m\.baidu\.com\/$|m\.baidu\.com\/\?/;
	const search = /\/s\?/;
	const url = window.location.href;
	const winHeight = window.innerHeight;
	const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	const purifyTask = new MutationObserver(records => {
		purify();
	});
	purifyTask.observe(document.body, {
		childList: true,
		subtree: true
	});
	purify();
	if (search.test(url)) {
		const redirectTask = new MutationObserver(records => {
			redirect();
		});
		redirectTask.observe(document.body, {
			attributeFilter: ['href'],
			childList: true
		});
		redirect();
		window.addEventListener('click', event => {
			if (underHref(event.target)) {
				event.stopPropagation();
			}
		}, true);
	}

	function purify() {
		if (search.test(url)) {
			let rubbish = document.querySelectorAll('.page-banner, #page-pre, #page-tips, #results>div:not([order]), [class*="c-recomm-wrap"], [tpl="recommend_list"], [tpl="sigma_celebrity_rela"], [class*="ec_"]');
			for (let i = 0; i < rubbish.length; i++) {
				rubbish[i].remove();
			}
			try {
				document.querySelector('#page-ft').style.setProperty('display', 'none', 'important');
				document.querySelector('#page-copyright').style.setProperty('margin-bottom', '0px', 'important');
			} catch (e) {}
		} else if (homepage.test(url)) {
			let rubbish = document.querySelectorAll('#navs~*, .blank-frame');
			for (let i = 0; i < rubbish.length; i++) {
				rubbish[i].remove();
			}
			try {
				document.querySelector('#userinfo-wrap').style.setProperty('visibility', 'hidden');
				const logo = document.querySelector('#logo');
				logo.style.setProperty('margin-top', winHeight / 4 - logo.offsetHeight + 'px', 'important');
				const header = document.querySelector('#header');
				const foot = document.querySelector('#foot');
				foot.style.setProperty('margin-top', winHeight - header.offsetHeight - foot.offsetHeight + 'px', 'important');
			} catch (e) {}
			const whiteEles = document.querySelectorAll('#index-card, .navs-bottom-bar, #bottom');
			for (let i = 0; i < whiteEles.length; i++) {
				whiteEles[i].style.backgroundColor = 'white';
			}
		}
	}

	function redirect() {
		const urlReg = /http[^']*/;
		const results = document.querySelectorAll('#results>.c-result');
		for (let result of results) {
			const resultUrl = result.dataset.log.match(urlReg);
			const clickElements = result.querySelectorAll('a[href]');
			for (let ele of clickElements) {
				if (ele.dataset && ele.dataset.url) {
					ele.setAttribute('href', ele.dataset.url.match(urlReg)[0]);
				} else if (resultUrl && resultUrl[0] !== 'https://baidu.com/' && !redirectException(ele)) {
					ele.setAttribute('href', resultUrl[0]);
				}
			}
		}
	}

	function redirectException(element) {
		const list = document.querySelectorAll('.c-line-bottom, div[rl-node]');
		while (true) {
			element = element.parentNode;
			if (element.id === 'results') {
				return false;
			}
			for (let ele of list) {
				if (ele === element) {
					return true;
				}
			}
		}
	}

	function underHref(element) {
		while (true) {
			if (element.getAttribute('href')) {
				return true;
			}
			if (element === document.body) {
				return false;
			}
			element = element.parentNode;
		}
	}
})();