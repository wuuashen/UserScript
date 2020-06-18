// ==UserScript==
// @name         Chrome 不翻译代码
// @namespace    https://github.com/wuuashen/UserScript
// @version      0.1
// @description  在 Chrome中不翻译代码
// @author       wuuashen
// @include      *
// @grant        none
// @version     0.0.1
// ==/UserScript==

(function() {
    'use strict';

    ['code', 'pre']
        .reduce((acc, cur) => {
        const nodeList = document.querySelectorAll(cur);
        return [...acc, ...nodeList];
    }, [])
        .forEach(elm => {
        elm.classList.add('notranslate');
        elm.setAttribute('translate', 'no');
    });

    console.log('😃 No translate class inject success.');
})();