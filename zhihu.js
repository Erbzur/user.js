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
    const search = /\/search?/.test(location.href);
    const homepage = /www.zhihu.com\/$|utm_medium/.test(location.href);
    if(question){
        const rules = [
            `.ContentItem-actions {
                flex-wrap: wrap;
            }`,
            `.ContentItem-action {
                margin-left: 10px !important;
                padding: 0 0px !important;
            }`,
            `.Menu-item, .HotBanner, .MobileAppHeader-downloadLink {
                display: none !important;
            }`
        ];
        adjustView(rules);
        fixSearchFunc();
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
            `.ContentItem-actions {
                flex-wrap: wrap;
            }`,
            `.VoteButton {
                padding: 0 10px !important;
            }`,
            `.ContentItem-action {
                margin-left: 10px !important;
                padding-left: 0px !important;
            }`,
            `[class="ContentItem-actions"]>:nth-last-child(2),
             .Popover,
             .ContentItem-actions.ContentItem-action>:last-child,
             .TopstoryItem--advertCard,
             .MobileAppHeader-downloadLink {
                display: none !important;
            }`,
            `.ContentItem-actions.ContentItem-action {
                margin-left: 0px !important;
            }`
        ];
        adjustView(rules);
        fixSearchFunc();
    }

    function adjustView(rules){
        let style = document.createElement('style');
        document.head.appendChild(style);
        for(let i = 0; i < rules.length; ++i){
            style.sheet.insertRule(rules[i]);
        }
    }

    function fixSearchFunc(){
        const addSearchBoxTask = new MutationObserver(records => {
            if(!document.querySelector('.MobileAppHeader-searchBox') && !document.querySelector('.added-searchBox')){
                addSearchBox();
            }
        });
        addSearchBoxTask.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function addSearchBox(){
        const searchBar = document.createElement('div');
        searchBar.setAttribute('style', `
            width: 80%;
            height: 32px;
            border-radius: 20px;
            border: 1px solid #ebebeb;
            background-color: rgba(235, 235, 235, 0.7);
            display: flex;
            align-items: center;
            padding-left: 10px;
        `);
        searchBar.addEventListener('click', () => {
            location.href = 'https://www.zhihu.com/search?type=content&q=';
        }, true);
        searchBar.innerHTML = `<svg class="Zi Zi--Search" fill="#999" viewBox="0 0 24 24" width="18" height="18">
                                 <path d="M17.068 15.58a8.377 8.377 0 0 0 1.774-5.159 8.421 8.421 0 1 0-8.42 8.421 8.38 8.38 0 0 0 5.158-1.774l3.879 3.88c.957.573 2.131-.464 1.488-1.49l-3.879-3.878zm-6.647 1.157a6.323 6.323 0 0 1-6.316-6.316 6.323 6.323 0 0 1 6.316-6.316 6.323 6.323 0 0 1 6.316 6.316 6.323 6.323 0 0 1-6.316 6.316z" fill-rule="evenodd">
                                 </path>
                               </svg>`;
        const searchBox = document.createElement('div');
        searchBox.className = 'added-searchBox';
        searchBox.setAttribute('style', `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        `);
        searchBox.appendChild(searchBar);
        const menu = document.querySelector('.MobileAppHeader-actions');
        if(menu){
            menu.parentNode.insertBefore(searchBox, menu);
        }
    }
})();