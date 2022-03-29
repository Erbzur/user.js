// ==UserScript==
// @name            Zhihu Share Answer
// @namespace       https://github.com/Erbzur/user.js
// @version         1.0
// @description     add support to copy answer link for convenience
// @author          Erbzur
// @include         *www.zhihu.com/question/*
// @grant           none
// ==/UserScript==

(function(){
    'use strict';
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    const answerList = document.querySelector('div[role="list"]');

    new MutationObserver(addShareButton).observe(answerList, {
        childList: true,
        subtree: true
    });

    function addShareButton(mutationList, observer){
        const answers = document.querySelectorAll('div[class="List-item"][tabindex]');
        answers.forEach(answer => {
            const meta = answer.querySelector('meta[content^="https://www.zhihu.com/question/"]');
            if(meta){
                const spanUpvotedInfo = answer.querySelector('div[class^="css-"]');
                if(spanUpvotedInfo){
                    const shareButton = document.createElement('span');
                    shareButton.innerHTML = `<span class="Voters">
                                                <button type="button" class="Button Button--plain">复制链接</button>
                                             </span>`.oneLine();
                    shareButton.style.setProperty('margin', '0 3em');
                    shareButton.addEventListener('click', async event => {
                        try{
                            await navigator.clipboard.writeText(meta.content);
                            window.alert('复制成功');
                        }catch(err){
                            window.prompt('Copy to clipboard: Ctrl+C, Enter', meta.content);
                        }
                    });
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