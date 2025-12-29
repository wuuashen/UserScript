// ==UserScript==
// @name         替换小红书链接在当前页面打开
// @namespace    http://tampermonkey.net/
// @version      2025-05-24
// @description  try to take over the world!
// @author       You
// @match        https://www.xiaohongshu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaohongshu.com
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    let count = 0
    function injectCls(deferElm){
        const elms = ['a.author', '.info > a', '.tag']
        .reduce((acc, cur) => {
            const nodeList = deferElm ? deferElm.querySelectorAll(cur) : document.querySelectorAll(cur);
            return [...acc, ...nodeList];
        }, [])
        for (const elm of elms) {
            elm.setAttribute('target', '_self')
        }

    }
    // document.addEventListener('DOMContentLoaded', () => { injectCls();alert(333) })
    window.onload = function(){
        injectCls()
    }

    let observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if(mutation.type !== 'childList') continue;
            injectCls(mutation.target)
        }
    });
    observer.observe(document.body, {childList: true, subtree: true});
    // setTimeout(() => { observer.disconnect() }, 3000)
})();