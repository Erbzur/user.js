// ==UserScript==
// @name            UOOC
// @namespace       http://tampermonkey.net/
// @version         2.1
// @description     uooc script for lazy persons
// @author          Erbzur
// @include         *www.uooc.net.cn/home/learn/*
// @grant           none
// ==/UserScript==

(function() {
    'use strict';
    let lazyMode = false;
    window.addEventListener('blur', event => {
        const player = document.querySelector('video');
        lazySwitch(player);
    });
    window.addEventListener('mouseout', event => {
        event.stopPropagation();
    }, true);
    autoplay();

    function lazySwitch(player) {
        if (!lazyMode && player && !player.paused) {
            player.muted = true;
            player.playbackRate = 2;
            player.onended = autoplay;
            lazyMode = true;
            player.addEventListener('pause', event => {
                if (lazyMode && !player.ended) {
                    player.muted = false;
                    player.playbackRate = 1;
                    player.onended = null;
                    lazyMode = false;
                }
            });
        }
    }

    function autoplay() {
        const delay = 500;
        setTimeout(nextVideo, delay, document);

        function nextVideo(parent) {
            const taskPoint = parent.querySelector('[class="basic ng-scope"]>.taskpoint');
            if (taskPoint) {
                const video = taskPoint.parentNode.querySelector('.icon-video');
                if (video) {
                    video.click();
                    setTimeout(() => {
                        const player = document.querySelector('video');
                        player.play();
                        if (lazyMode) {
                            lazyMode = false;
                            lazySwitch(player);
                        }
                    }, delay);
                } else {
                    showNotice('遭遇测验，请完成测验后再继续！');
                    lazyMode = false;
                }
            } else {
                const chapter = parent.querySelector('[class^="rank-"]').querySelector('.uncomplete');
                if (chapter) {
                    if (!chapter.nextElementSibling) {
                        chapter.click();
                    }
                    setTimeout(nextVideo, delay, chapter.parentNode);
                } else {
                    showNotice('视频进度已全部完成！');
                }
            }
        }

        function showNotice(msg) {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    new Notification('自动播放中断', {
                        body: msg,
                        icon: 'http://www.uooc.net.cn/favicon.ico',
                        requireInteraction: true
                    });
                }
            });
        }
    }
})();