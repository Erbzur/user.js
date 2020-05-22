// ==UserScript==
// @name            iTunes HD Covers
// @namespace       http://tampermonkey.net/
// @version         1.0
// @description     click on the cover to get the 1500x1500 picture.
// @author          Erbzur
// @include         *itunes.apple.com/ca/album/*
// @grant           none
// ==/UserScript==

(function(){
    'use strict';
    const covers = document.querySelectorAll('picture[class*="product"]');
    const pixel = /\d+(?=x0w\.jpg$)/;
    for(let ele of covers){
        try{
            const coverURL = ele.querySelector('img').getAttribute('src');
            ele.addEventListener('click', event => {
                window.open(coverURL.replace(pixel, '1500'));
            });
            ele.style.cursor = 'pointer';
        }catch(e){}
    }
})();