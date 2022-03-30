// ==UserScript==
// @name            Zhihu Share Answer
// @namespace       https://github.com/Erbzur/user.js
// @version         1.2
// @description     add support to copy answer link for convenience
// @author          Erbzur
// @include         *www.zhihu.com/question/*
// @grant           none
// ==/UserScript==

(function(){
    'use strict';
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    new MutationObserver(addShareButton).observe(document.body, {
        childList: true,
        subtree: true
    });

    function addShareButton(mutationList, observer){
        const answers = document.querySelectorAll('div[tabindex="0"]:not([class*="share"])');
        answers.forEach(answer => {
            const meta = answer.querySelector('meta[content^="https://www.zhihu.com/question/"]');
            if(meta){
                const spanUpvotedInfo = answer.querySelector('div[class^="css-"]');
                if(spanUpvotedInfo){
                    const shareButton = document.createElement('span');
                    shareButton.innerHTML = `<span class="Voters">
                                                <button type="button" class="Button Button--plain">
                                                    <a href="${meta.content}" target="_blank">答案链接</a>
                                                </button>
                                             </span>`.oneLine();
                    shareButton.style.setProperty('margin', '0 3em');
                    spanUpvotedInfo.appendChild(shareButton);
                    answer.classList.add('share');
                }
            }else{
                console.log(answer);
                console.error('anwser link not found');
                answer.classList.add('share-err');
            }
        });
    }

    Object.defineProperty(String.prototype, 'oneLine', {
        enumerable: false,
        value: function() {
            return this.replace(/ *[\r|\n] */gm, '');
        }
    });
})();