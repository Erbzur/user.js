/* zhihu.com */
(function() {
    'use strict';
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    switch (location.host) {
        case 'www.zhihu.com': {
            processCommon();
            break;
        }
        case 'zhuanlan.zhihu.com': {
            processZhuanlan();
            break;
        }
    }

    function processCommon() {
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
        addCSS(`
            .QuestionHeader-title,
            .List-headerText,
            .Card-headerText,
            .AuthorInfo-name,
            .ztext b,
            .Topbar-title,
            .ContentItem-title,
            .Tabs-link.is-active {
                font-family: system-ui;
                font-weight: bold;
            }
            .MobileModal-wrapper {
                z-index: 2;
            }
            .Comments {
                overflow: unset !important;
            }
            .CommentEditor-hiddenInput {
                display: none !important;
            }
            .Comments-footer-wrapper {
                position: sticky !important;
                bottom: 0;
            }
        `);
        const question = /\/question\//.test(location.pathname);
        const search = /\/search$/.test(location.pathname);
        if (question) {
            addCSS(`
                .ContentItem-actions {
                    flex-wrap: wrap;
                }
                .Menu-item.ContentItem-action {
                    width: unset !important;
                }
                .Button.ContentItem-action, .Popover {
                    margin-left: 10px !important;
                    padding: 0 !important;
                }
                .VoteButton, .AnswerItem-selfMenuItem {
                    padding: 0 10px !important;
                }
                .MobileAppHeader-downloadLink,
                .HotBanner,
                .HotQuestions-title,
                .HotQuestions-section>a,
                .HotQuestions-bottomButton,
                .Question-main>div[style],
                #div-gpt-ad-hotFeedAd {
                    display: none !important;
                }
            `);
            new MutationObserver(() => {
                addSearchBox();
                addOpenInAppButton();
            }).observe(document.body, {
                childList: true,
                subtree: true
            });
        } else if (search) {
            addCSS(`
                .ZvideoItem .RichText,
                .ZvideoItem .SearchItem-rightImg {
                    display: none !important;
                }
                .WikiBoxReview-mobile {
                    margin-bottom: 0;
                }
            `);
            window.addEventListener('load', () => {
                document.querySelector('.MobileAppHeader-actions')?.style?.setProperty('width', '100%');
                document.querySelector('input')?.setAttribute('placeholder', '');
                document.querySelector('.MobileAppHeader-expandBtn')
                    ?.addEventListener('click', () => location.href = 'https://www.zhihu.com/');
                document.querySelector('.App-main')?.style?.setProperty('overflow-x', 'hidden');
            });
        }
    }

    function processZhuanlan() {
        window.addEventListener('load', () => {
            document.querySelector('.OpenInAppButton')?.style?.setProperty('display', 'none');
            document.querySelector('.Post-ActionMenuButton')?.style?.setProperty('flex', '1');
            if (!document.querySelector('#open-in-app')) {
                const openInApp = document.createElement('button');
                openInApp.id = 'open-in-app';
                openInApp.innerText = 'Open In App';
                openInApp.addEventListener('click', () => {
                    const pattern = location.pathname.match(/\/p\/([0-9]+)/);
                    location.href = `zhihu://articles/${pattern[1]}`;
                });
                openInApp.setAttribute('style', `
                    flex: 3;
                    color: #06f;
                `.oneLine());
                document.querySelector('.ContentItem-actions')?.appendChild(openInApp);
            }
        });
    }

    function addOpenInAppButton() {
        if (!document.querySelector('#open-in-app')) {
            const openInApp = document.createElement('button');
            openInApp.id = 'open-in-app';
            openInApp.innerText = 'Open In App';
            openInApp.addEventListener('click', () => {
                const pattern = location.pathname.match(/\/question\/([0-9]+)(?:\/answer\/([0-9]+))?/);
                location.href = `zhihu://${pattern[2] ? `answers/${pattern[2]}` : `questions/${pattern[1]}`}`;
            });
            openInApp.setAttribute('style', `
                position: fixed;
                height: 2.5em;
                left: 50%;
                bottom: 1em;
                z-index: 1;
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
            `.oneLine());
            document.body.appendChild(openInApp);
            let prevScrollpos = window.scrollY;
            window.addEventListener('scroll', () => {
                const curScrollPos = window.scrollY;
                if (curScrollPos > prevScrollpos) {
                    openInApp.style.bottom = '-2.5em';
                } else {
                    openInApp.style.bottom = '1em';
                }
                prevScrollpos = curScrollPos;
            });
        }
    }

    function addSearchBox() {
        if (!document.querySelector('.MobileAppHeader-searchBox') && !document.querySelector('.added-searchBox')) {
            const input = document.createElement('input');
            input.setAttribute('type', 'search');
            input.setAttribute('placeholder', 'search');
            input.setAttribute('style', `
                padding: 0.5em 0.8em;
                font-size: 1em;
                background-color: hsla(0,0%,92.2%,.72);
                border-radius: 1em;
                border: none;
                resize: none;
                outline: none;
                overflow: hidden;
            `.oneLine());
            input.addEventListener('keydown', event => {
                if (event.key === 'Enter') {
                    location.href = `https://www.zhihu.com/search?q=${input.value}`;
                }
            });
            const searchBox = document.createElement('label');
            searchBox.className = 'added-searchBox';
            searchBox.setAttribute('style', `
                width: 60vw;
                display: flex;
            `.oneLine());
            searchBox.appendChild(input);
            const header = document.querySelector('.MobileAppHeader-actions');
            if (header) {
                header.insertBefore(searchBox, header.firstChild);
            }
        }
    }

    function addCSS(css) {
        document.head.appendChild(document.createElement("style")).innerHTML = css;
    }

    Object.defineProperty(String.prototype, 'oneLine', {
        enumerable: false,
        value: function() {
            return this.replace(/ *[\r|\n] */gm, '');
        }
    });
})();