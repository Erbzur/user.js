// ==UserScript==
// @name            Pure Mobile Baidu
// @namespace       http://tampermonkey.net/
// @version         4.1
// @description     purify the shitty mobile baidu pages
// @author          Erbzur
// @include         *www.baidu.com*
// @grant           none
// ==/UserScript==

(function(){
    'use strict';
    const search = /word=./.test(location.href);
    const homepage = /^https:\/\/www.baidu.com\/?/.test(location.href);
    const search_rules = [
        '.page-banner',
        '#page-pre',
        '#page-tips',
        '#results>div:not([order])',
        '[class*="c-recomm-wrap"]',
        '[tpl="recommend_list"]',
        '[tpl="sigma_celebrity_rela"]',
        '[class*="ec_"]',
        '#page-copyright>[style]',
        '.na-like-container',
        '#relativewords>.c-line-clamp1'
    ];
    const homepage_rules = [
        '#index-card>:not(#header):not(#personal-center):not(#menu-container):not(#bottom)',
        '#navs~*'
    ];
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
    if(search){
        const redirectTask = new MutationObserver(records => {
            redirect();
        });
        redirectTask.observe(document.body, {
            attributeFilter: ['href'],
            childList: true
        });
        redirect();
        window.addEventListener('click', event => {
            if(underHref(event.target)){
                event.stopPropagation();
            }
        }, true);
    }else if(homepage){
        window.addEventListener('focus', event => {
            if(event.target.id === 'index-kw'){
                event.stopPropagation();
            }
        }, true);
    }

    function purify(){
        if(search){
            removeAds(search_rules);
            try{
                document.querySelector('#page-ft').style.setProperty('display', 'none', 'important');
                document.querySelector('#page-copyright').style.setProperty('margin-bottom', '0px', 'important');
            }catch(e){}
        }else if(homepage){
            removeAds(homepage_rules);
            try{
                document.querySelector('#userinfo-wrap').style.setProperty('visibility', 'hidden');
                const logo = document.querySelector('#logo');
                logo.style.setProperty('margin-top', winHeight / 4 - logo.offsetHeight + 'px', 'important');
                const header = document.querySelector('#header');
                const foot = document.querySelector('#foot');
                foot.style.setProperty('margin-top', winHeight - header.offsetHeight - foot.offsetHeight + 'px', 'important');
            }catch(e){}
            const whiteEles = document.querySelectorAll('#index-card, .navs-bottom-bar, #bottom');
            for(let i = 0; i < whiteEles.length; ++i){
                whiteEles[i].style.backgroundColor = 'white';
            }
        }
    }

    function removeAds(blacklist){
        let rubbish = document.querySelectorAll(blacklist.toString());
        for(let i = 0; i < rubbish.length; ++i){
            rubbish[i].remove();
        }
    }

    function redirect(){
        const urlReg = /http[^']*/;
        const results = document.querySelectorAll('#results>.c-result');
        for(let result of results){
            const resultUrl = result.dataset.log.match(urlReg);
            const clickElements = result.querySelectorAll('a[href]');
            for(let ele of clickElements){
                if(ele.dataset && ele.dataset.url){
                    ele.setAttribute('href', ele.dataset.url.match(urlReg)[0]);
                }else if(resultUrl && resultUrl[0] !== 'https://baidu.com/' && !redirectException(ele)){
                    ele.setAttribute('href', resultUrl[0]);
                }
            }
        }
    }

    function redirectException(element){
        const list = document.querySelectorAll('.c-line-bottom, div[rl-node]');
        while(true){
            element = element.parentNode;
            if(element.id === 'results'){
                return false;
            }
            for(let ele of list){
                if(ele === element){
                    return true;
                }
            }
        }
    }

    function underHref(element){
        while(true){
            if(element.getAttribute('href')){
                return true;
            }
            if(element === document.body){
                return false;
            }
            element = element.parentNode;
        }
    }
})();