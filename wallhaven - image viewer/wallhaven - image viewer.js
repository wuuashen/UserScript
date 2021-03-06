// ==UserScript==
// @name        wallhaven - image viewer
// @namespace   wuuashen
// @description Enhanced user experience for wallhaven.cc
// @author      wuuashen (https://github.com/wuuashen)
// @copyright   2020-04-14，Require fancybox
// @license     MIT License; https://opensource.org/licenses/MIT
// @include     https://wallhaven.cc/*
// @version     0.0.3
// @grant       none
// ==/UserScript==
;(function(){

    const loadScript = () => {
        return new Promise(resolve => {
            var script2 = document.createElement('script');
            script2.src = 'https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js';
            document.head.appendChild(script2);
            script2.onload = () => resolve();
        })
    }
    const loadStylesheet = () => {
        return new Promise(resolve => {
            var style1 = document.createElement('link');
            style1.rel = 'stylesheet';
            style1.href = 'https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css';
            document.head.appendChild(style1);
            style1.onload = () => resolve();
        })
    }

    async function loadFancybox(params) {
        await loadScript();
        await loadStylesheet();
        return 'fancybox done.';
    }

    const callFancyBox = () => {
        loadFancybox().then(res => {
            let walllist = document.querySelectorAll('.thumbs-container ul li');

            for (const [key, element] of Object.entries(walllist)) {
                let preview = element.querySelector('.preview'),
                    thumbInfo = element.querySelector('.thumb-info span.png') ? 'png' : 'jpg';

                if(preview.getAttribute('data-href')) continue;
                // 5wq8x8
                let wallId = /wallhaven\.cc\/w\/(\w{6})/.exec(preview.href)[1];
                // https://w.wallhaven.cc/full/5w/wallhaven-5wq8x8.jpg
                let pathId = wallId.substring(0, 2);
                preview.setAttribute('data-href', preview.href);
                preview.setAttribute('data-fancybox', 'gallery');
                preview.href = `https://w.wallhaven.cc/full/${pathId}/wallhaven-${wallId}.${thumbInfo}`;
            }


            $('[data-fancybox="gallery"]').fancybox({
                // loop: true,
                buttons: [
                    "zoom",
                    "share",
                    "slideShow",
                    "fullScreen",
                    "download",
                    "thumbs",
                    "close"
                ],
                thumbs: {
                    autoStart: true
                }
            });
        })
    }

    callFancyBox();
    let observer = new MutationObserver(mutationRecords => {
        if(mutationRecords[0].addedNodes.length && mutationRecords[0].addedNodes[0].className == 'thumb-listing-page') {
            callFancyBox();
            console.log(mutationRecords);
        }
    });

    observer.observe(document.querySelector('.thumbs-container'), {
        childList: true,
        characterDataOldValue: true
    });

})()
