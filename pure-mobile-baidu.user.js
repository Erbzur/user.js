// ==UserScript==
// @name            Pure Mobile Baidu
// @namespace       https://github.com/Erbzur/user.js
// @version         4.3
// @description     purify the shitty mobile baidu pages
// @author          Erbzur
// @include         *www.baidu.com*
// @include         *m.baidu.com*
// @grant           none
// ==/UserScript==

(function () {
    'use strict';
    const search = /word=./.test(location.href);
    const homepage = /^https:\/\/(www|m).baidu.com\/?/.test(location.href);
    const searchRules = [
        `[class*="banner"],
         #results-pre,
         #page-pre,
         #page-ft,
         #results>div:not([order]),
         [class*="c-recomm-wrap"],
         [tpl="recommend_list"],
         [tpl="sigma_celebrity_rela"],
         [class*="ec_"],
         #page-copyright>[style],
         .na-like-container,
         [data-video-player],
         #relativewords>.c-line-clamp1 {
             display: none !important;
         }`,
        `#page-copyright {
             margin-bottom: 0px !important;
         }`
    ];
    const homepageRules = [
        `#index-card>:not(#header):not(#personal-center):not(#menu-container):not(#bottom),
         #navs~* {
             display: none !important;
         }`,
        `#userinfo-wrap {
             visibility: hidden;
         }`,
        `#index-card, .navs-bottom-bar, #bottom {
             background-color: white !important;
         }`
    ];
    const winHeight = window.innerHeight;
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    const style = document.createElement('style');
    document.head.appendChild(style);
    if (search) {
        searchRules.forEach(rule => style.sheet.insertRule(rule));
        new MutationObserver(enableOpenInNewTab).observe(document.body, {
            attributeFilter: ['href'],
            childList: true
        });
        enableOpenInNewTab();
        window.addEventListener('click', event => {
            if (underHref(event.target)) {
                event.stopPropagation();
            }
        }, true);
    } else if (homepage) {
        homepageRules.forEach(rule => style.sheet.insertRule(rule));
        new MutationObserver(adjustLayout).observe(document.body, {
            childList: true,
            subtree: true
        });
        adjustLayout();
        window.addEventListener('focus', event => {
            if (event.target.id === 'index-kw') {
                event.stopPropagation();
            }
        }, true);
    }

    function adjustLayout() {
        try {
            const logo = document.querySelector('#logo');
            logo.style.setProperty('margin-top', winHeight / 4 - logo.offsetHeight + 'px', 'important');
            const header = document.querySelector('#header');
            const foot = document.querySelector('#foot');
            foot.style.setProperty('margin-top', winHeight - header.offsetHeight - foot.offsetHeight + 'px', 'important');
        } catch (ignored) { /* empty */ }
    }

    function enableOpenInNewTab() {
        document.querySelectorAll('#results>.c-result').forEach(result => {
            result.querySelectorAll('a[href]').forEach(aTag => {
                aTag.setAttribute('target', '_blank');
            });
        });
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