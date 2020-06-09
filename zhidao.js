/* zhidao.baidu.com */
(function(){
    'use strict';
    const rules = [
        '#main-content>div:not(.question-container):not(.question-line):not(.question-comment-wrapper)',
        '.question-container>div:not(.wgt-question):not(.question-answer-container):not(.question-line)' +
        ':not(.best-answer-container):not(.wgt-replies-entry):not(#other-replies-list):not(#wgt-related-questions-new)'
    ];
    window.onload = () => {
        let rubbish = document.querySelectorAll(rules.toString());
        console.log(rubbish.length);
        for(let i = 0; i < rubbish.length; i++){
            rubbish[i].remove();
        }
    };
    window.addEventListener('scroll', event => {
        event.stopPropagation();
    }, true);
})();