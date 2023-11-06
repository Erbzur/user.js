// ==UserScript==
// @name            Apple Music HD Covers
// @namespace       https://github.com/Erbzur/user.js
// @version         1.1
// @description     click on the album cover to get 1500x1500 cover picture.
// @author          Erbzur
// @include         *music.apple.com/*/album/*
// @grant           none
// ==/UserScript==

(function () {
    'use strict';
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    new MutationObserver(applyHDCover).observe(document.body, {
        childList: true,
        subtree: true
    });
    applyHDCover();

    function applyHDCover() {
        const cover = document.querySelector('div[slot="artwork"]');
        if (cover) {
            try {
                const coverURL = cover.querySelector('img').currentSrc;
                cover.addEventListener('click', () => {
                    window.open(coverURL.replace(/\d+x\d+/, '1500x1500'));
                });
                cover.style.cursor = 'pointer';
            } catch (ignored) { /* empty */ }
        }
    }
})();