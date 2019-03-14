// ==UserScript==
// @name            UOOC
// @namespace       http://tampermonkey.net/
// @version         1.0
// @description     uooc script for lazy persons
// @author          Erbzur
// @include         *www.uooc.net.cn/home/learn/*
// @grant           none
// ==/UserScript==

(function() {
	'use strict';
	let lazy = false;
	window.addEventListener('blur', event => {
		const video = document.querySelector('#player_html5_api');
		if (lazy === false && video.paused === false) {
			video.muted = true;
			video.playbackRate = 2;
			video.onended = () => {
				alert('Video ended!');
			};
			lazy = true;
			video.addEventListener('pause', event => {
				if (lazy !== false) {
					video.muted = false;
					video.playbackRate = 1;
					video.onended = null;
					lazy = false;
				}
			});
		}
	});
	window.addEventListener('mouseout', event => {
		event.stopPropagation();
	}, true);
})();