/* www.zhihu.com */
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
    if(question){
        applyCSS([
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
            `.MobileAppHeader-downloadLink,
             .HotBanner,
             .HotQuestions-title,
             .HotQuestions-section>a,
             .HotQuestions-bottomButton,
             .Question-main>div[style],
             #div-gpt-ad-hotFeedAd {
                display: none !important;
            }`
        ]);
        new MutationObserver((mutationList, observer) => {
            addSearchBox();
            addOpenInAppButton();
        }).observe(document.body, {
            childList: true,
            subtree: true
        });
    }else if(search){
        window.onload = () => {
            document.querySelector('.MobileAppHeader-actions').style.setProperty('width', '100%');
            document.querySelector('input').setAttribute('placeholder', '');
            document.querySelector('.MobileAppHeader-expandBtn').onclick = () => {
                location.href = 'https://www.zhihu.com/';
            };
        };
    }

    function addOpenInAppButton(){
        if(!document.querySelector('#open-in-app')){
            const openInApp = document.createElement('button');
            openInApp.id = 'open-in-app';
            openInApp.innerText = 'Open In App';
            openInApp.addEventListener('click', event => {
                const pattern = location.pathname.match(/\/question\/([0-9]+)(?:\/answer\/([0-9]+))?/);
                location.href = `zhihu://${pattern[2] ? `answers/${pattern[2]}` : `questions/${pattern[1]}`}`;
            });
            openInApp.setAttribute('style', `
                position: fixed;
                height: 2.5em;
                left: 50%;
                bottom: 1em;
                z-index: 1000;
                margin: 0;
                padding: 0 1em;
                font-size: 1em;
                line-height: 2.4em;
                color: rgb(255, 255, 255);
                background: rgb(0, 102, 255);
                border: none;
                border-radius: 1.2em;
                box-shadow: rgba(18, 18, 18, 0.25) 0px 2px 5px;
                outline: none;
                transform: translate(-50%);
                transition: bottom 0.3s;
            `);
            const root = document.querySelector('#root');
            if(root){
                root.appendChild(openInApp);
                let prevScrollpos = window.pageYOffset;
                window.addEventListener('scroll', event => {
                    const curScrollPos = window.pageYOffset;
                    if(curScrollPos > prevScrollpos) {
                        openInApp.style.bottom = '-2.5em';
                    }else{
                        openInApp.style.bottom = '1em';
                    }
                    prevScrollpos = curScrollPos;
                });
            }else{
                console.error('addOpenInAppButton: #root not found');
            }
        }
    }

    function addSearchBox(){
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
                height: 2em;
                border-radius: 1.3em;
                border: 1px solid #ebebeb;
                background-color: rgba(235, 235, 235, 0.7);
                display: flex;
                align-items: center;
                padding-left: 10px;
            `);
            wrapper.appendChild(input);
            const searchBox = document.createElement('div');
            searchBox.className = 'added-searchBox';
            searchBox.appendChild(wrapper);
            const header = document.querySelector('.MobileAppHeader-actions');
            if(header){
                header.parentNode.insertBefore(searchBox, header);
            }
            const menu = document.querySelector('.MobileAppHeader-navItem');
            if(menu && menu.style){
                menu.style.setProperty('margin-left', '0');
                menu.style.setProperty('margin-right', '1em');
            }
        }
    }

    function applyCSS(rules){
        let style = document.createElement('style');
        document.head.appendChild(style);
        for(let i = 0; i < rules.length; ++i){
            style.sheet.insertRule(rules[i]);
        }
    }
})();