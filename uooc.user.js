// ==UserScript==
// @name            UOOC
// @namespace       https://github.com/Erbzur/user.js
// @version         2.4
// @description     uooc script for lazy persons
// @author          Erbzur
// @include         *www.uooc.net.cn/home/learn/*
// @grant           none
// ==/UserScript==

(function() {
    'use strict';
    let lazyMode = false;
    window.addEventListener('mouseout', event => {
        event.stopPropagation();
    }, true);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            const player = document.querySelector('video');
            if (player) {
                lazySwitch(player);
            }
        }
    });
    autoplay();

    function lazySwitch(player) {
        if (!player.paused) {
            player.muted = true;
            player.playbackRate = 2;
            player.onended = autoplay;
            player.onpause = () => {
                if (!player.ended) {
                    player.muted = false;
                    player.playbackRate = 1;
                    player.onended = null;
                    player.onpause = null;
                    lazyMode = false;
                }
            };
            lazyMode = true;
        }
    }

    function autoplay() {
        const delay = 500;
        const timer = setInterval(() => {
            if (document.querySelector('[class^="rank-"]')) {
                clearInterval(timer);
                nextVideo(document);
            }
        }, delay);

        function nextVideo(parent) {
            const taskPoint = parent.querySelector('[class^="basic ng-scope"]:not(.complete)>.taskpoint');
            if (taskPoint) {
                const video = taskPoint.parentNode.querySelector('.icon-video');
                if (video) {
                    video.click();
                    const timer = setInterval(() => {
                        const player = document.querySelector('video');
                        if (player) {
                            clearInterval(timer);
                            player.play();
                            if (lazyMode) {
                                lazySwitch(player);
                            }
                        }
                    }, delay);
                } else {
                    showNotice('遭遇测验，请完成测验后再继续！');
                }
            } else {
                const chapter = parent.querySelector('[class^="rank-"]').querySelector('.uncomplete');
                if (chapter) {
                    if (!chapter.nextElementSibling) {
                        chapter.click();
                    }
                    const timer = setInterval(() => {
                        if (chapter.nextElementSibling) {
                            clearInterval(timer);
                            nextVideo(chapter.parentNode);
                        }
                    }, delay);
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