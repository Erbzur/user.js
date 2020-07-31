/* zhihu.com */
(function(){
    'use strict';
    Object.defineProperties(window.navigator, {
        'userAgent': {
            value: 'Mozilla/5.0 (Windows Phone 10)'
        },
        'appVersion': {
            value: '5.0 (Windows Phone 10)'
        },
        'platform': {
            value: 'Win32'
        }
    });
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    const question = /\/question\//.test(location.href);
    const search = /\/search\?/.test(location.href);
    const homepage = /www.zhihu.com\/$|utm_medium/.test(location.href);
    if(question){
        const rules = [
            `.MobileAppHeader-downloadLink,
             .HotBanner,
             .HotQuestions-title,
             .HotQuestions-section>a,
             .HotQuestions-bottomButton,
             .Question-main>div[style],
             #div-gpt-ad-hotFeedAd {
                display: none !important;
            }`,
            `.ContentItem-actions {
                flex-wrap: wrap;
            }`,
            `.Menu-item.ContentItem-action {
                width: unset !important;
            }`,
            `.Button.ContentItem-action, .Popover {
                margin-left: 10px !important;
                padding: 0 !important;
            }`,
            `.VoteButton, .AnswerItem-selfMenuItem {
                padding: 0 10px !important;
            }`
        ];
        adjustView(rules);
        addSearchBox();
        addOpenInAppButton();
    }else if(search){
        window.onload = () => {
            document.querySelector('.MobileAppHeader-actions').style.setProperty('width', '100%');
            document.querySelector('input').setAttribute('placeholder', '');
            document.querySelector('.MobileAppHeader-expandBtn').onclick = () => {
                location.href = 'https://www.zhihu.com/';
            };
        };
    }else if(homepage){
        const rules = [
            `.TopstoryItem--advertCard,
             .MobileAppHeader-downloadLink,
             .DownloadGuide {
                display: none !important;
            }`,
            `.RichContent.is-collapsed .RichContent-inner {
                max-height: unset;
            }`,
            `.ContentItem-actions {
                flex-wrap: wrap;
            }`,
            `.Menu-item.ContentItem-action {
                width: unset !important;
            }`,
            `.Button.ContentItem-action, .Popover {
                margin-left: 10px !important;
                padding: 0 !important;
            }`,
            `.VoteButton, .AnswerItem-selfMenuItem {
                padding: 0 10px !important;
            }`,
            `.ZVideoItem-toolbar {
                padding: 0 !important;
            }`
        ];
        adjustView(rules);
        addSearchBox();
    }

    function addOpenInAppButton(){
        new MutationObserver(records => {
            if(document.readyState === 'complete' && !document.querySelector('#open-in-app')){
                const openInApp = document.createElement('button');
                openInApp.id = 'open-in-app';
                openInApp.setAttribute('style', `
                    position: fixed;
                    right: 12px;
                    bottom: 70px;
                    z-index: 100;
                    margin: 0;
                    padding: 0;
                    width: 40px;
                    line-height: 40px;
                    font-size: 20px;
                    color: #fff;
                    background: #0084ff;
                    border-radius: 20px;
                    box-shadow: 0 2px 5px rgba(26,26,26,.25);
                    border: none;
                    outline: none;
                `);
                openInApp.innerText = 'A';
                openInApp.addEventListener('click', event => {
                    const pattern = location.pathname.match(/\/question\/([0-9]+)(?:\/answer\/([0-9]+))?/);
                    location.href = `zhihu://${pattern[2] ? `answers/${pattern[2]}` : `questions/${pattern[1]}`}`;
                });
                const root = document.querySelector('#root');
                const backToTop = document.querySelector('.CornerAnimayedFlex');
                if(root.hasChildNodes()){
                    if(backToTop){
                        backToTop.parentNode.insertBefore(openInApp, backToTop);
                    }
                }else{
                    openInApp.style.setProperty('width', '50%');
                    openInApp.style.setProperty('right', '50%');
                    openInApp.style.setProperty('transform', 'translate(50%)');
                    openInApp.innerText = 'Open In App';
                    root.appendChild(openInApp);
                }
            }
        }).observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function addSearchBox(){
        new MutationObserver(records => {
            if(!document.querySelector('.MobileAppHeader-searchBox') && !document.querySelector('.added-searchBox')){
                const input = document.createElement('input');
                input.setAttribute('type', 'search');
                input.setAttribute('placeholder', 'search');
                input.setAttribute('style', `
                    width: 95%;
                    padding: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-family: inherit;
                    font-size: 95%;
                    font-weight: inherit;
                    background: transparent;
                    border: none;
                    resize: none;
                    outline: none;
                `);
                input.addEventListener('keydown', event => {
                    if(event.key === 'Enter'){
                        location.href = `https://www.zhihu.com/search?q=${input.value}`;
                    }
                });
                const wrapper = document.createElement('div');
                wrapper.setAttribute('style', `
                    width: 80%;
                    height: 32px;
                    border-radius: 20px;
                    border: 1px solid #ebebeb;
                    background-color: rgba(235, 235, 235, 0.7);
                    display: flex;
                    align-items: center;
                    padding-left: 10px;
                `);
                wrapper.appendChild(input);
                const searchBox = document.createElement('div');
                searchBox.className = 'added-searchBox';
                searchBox.setAttribute('style', `
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `);
                searchBox.appendChild(wrapper);
                const header = document.querySelector('.MobileAppHeader-actions');
                if(header){
                    header.parentNode.insertBefore(searchBox, header);
                }
                const menu = document.querySelector('.MobileAppHeader-navItem');
                if(menu && menu.style){
                    menu.style.setProperty('margin-left', '0');
                    menu.style.setProperty('margin-right', '16px');
                }
            }
        }).observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function adjustView(rules){
        let style = document.createElement('style');
        document.head.appendChild(style);
        for(let i = 0; i < rules.length; ++i){
            style.sheet.insertRule(rules[i]);
        }
    }
})();