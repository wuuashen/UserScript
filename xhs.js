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
            const nodeList = (deferElm && deferElm.querySelectorAll) ? deferElm.querySelectorAll(cur) : document.querySelectorAll(cur);
            return [...acc, ...nodeList];
        }, [])
        for (const elm of elms) {
            elm.setAttribute('target', '_self')
        }
    }

    function handleAutoClickAlbum(deferElm) {
        if (!deferElm || !deferElm.querySelectorAll) return;
        
        // 查找包含“加入专辑”的元素
        const msgContainers = deferElm.querySelectorAll('.msg-container.message-content');
        msgContainers.forEach(container => {
            const rightArea = container.querySelector('.right-area');
            if (rightArea) {
                const span = Array.from(rightArea.querySelectorAll('span')).find(s => s.textContent.trim() === '加入专辑');
                if (span) {
                    console.log('[xhs.js] 检测到“加入专辑”按钮，执行自动点击');
                    span.click();
                }
            }
        });
    }

    // document.addEventListener('DOMContentLoaded', () => { injectCls();alert(333) })
    window.onload = function(){
        injectCls()
    }

    let observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if(mutation.type !== 'childList') continue;
            injectCls(mutation.target)
            handleAutoClickAlbum(mutation.target)
        }
    });
    observer.observe(document.body, {childList: true, subtree: true});
    // setTimeout(() => { observer.disconnect() }, 3000)
})();