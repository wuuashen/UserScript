// ==UserScript==
// @name         115Mod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wuuashen
// @include      https://115.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=115.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// ==/UserScript==

(function() {

  class mod115 {
    // 实例
    constructor() {

      this.Link = {
        offlineUI: 'https://115.com/?tab=offline&mode=wangpan',
        filesUI: 'https://115.com/?cid=325469714140895815&offset=0&mode=wangpan'
      }
      const win = unsafeWindow.top.window

      this.addStyle()
      // 在顶层窗口中
      if(self === top.window) {
        this.findMagnet(unsafeWindow)
        return
      }
      // console.log(unsafeWindow.location.href, win.location.href, 'href111');
      // 在iframe中
      this.addButton(win)
      this.autoCheckDelSourceFile(win)
      if(win.location.href === this.Link.offlineUI) {
        this.classifyTasks()
      }
    }

    // 添加公共样式
    addStyle() {
      GM_addStyle(`
      @import url("https://fonts.googleapis.com/css?family=Montserrat");
      body,input,textarea,select,button,a {
        font-family: Montserrat, 'Pingfang SC','Microsoft Yahei','Segoe UI Emoji',Emoji,Arial !important;
      }
      li[val="set_copy"], li[val="copy_list"], li[val="hide_file"], li[val="show_play_long"], li[val="cover"], li[val="same"], li[val="edit"], li[id="read_mark"] {
        display: none !important
      }      
      .pvc-photo-wrap img:nth-child(2) {
        visibility: visible !important;
        transform: rotate(0deg);
        display: block;
        cursor: move;
        image-orientation: none;
        --darkreader-inline-bgcolor: rgb(0 0 0 / 10%) !important;
      }
      .previewer-container{
        background-color: rgb(0 0 0 / 0%);
      }      
      .container-ceiling, .container-main, .dialog-box, .feature-float, .article-reader {
        filter: none !important;
      }      
      .lstc-uploadlink .file-operate a {
        background: #fff !important;
        border-radius: 12px;
      }
      [data-darkreader-scheme="dark"] .lstc-uploadlink .file-operate .icon-operate {
        background-position-y: -60px;
      }
      .list-contents .file-size, .ifst-downing+span{
        color: rgba(26,39,52,1);
      }
      #js-warp .file-name-wrap, .list-header .header-name {
        flex-basis: 35vw !important;
        flex-grow: 0 !important;
        order: 0
      }
      #js-warp .file-operate, .lstc-uploadlink .header-operate {
        order: 1
      }
      #js-warp .file-size, .list-header .header-size {
        order: 2
      }
      #js-warp .file-process, .lstc-uploadlink .header-process{
        order: 3
      }      
      .dialog-handle .close {
        width: 50px;
        height: 50px;
        background-color: rgb(5, 66, 164);
        border-radius: 4px;
      }
      .list-contents .file-size, .ifst-downing+span, .list-contents .file-modified, .list-contents .file-typename, .list-contents .file-directory{
        font-size: 14px;
      }
      .promptbar-caution.promptbar-invflow{
        display:none;
      }
      .top-file-path{
        float: left;
      }
      `)
    }

    // 添加一些简单易用的按钮
    addButton(win) {
      let $leftTvf = $('#js_top_panel_box .left-tvf')
      // 添加 刷新离线列表状态 按钮
      const reloadOfflineButton = () => {
        $leftTvf.append(`
          <a class="button btn-line reload-offline" href="javascript:;">
            <span style="margin-right: 5px;font-size: 16px">🔄</span>
            <span>刷新离线列表状态</span>
          </a>
        `).on('click', '.reload-offline', () => {
          win.Core.OFFL5Plug.Reload()
        })
        GM_addStyle(`
          body .top-vflow .left-tvf .button {
            margin-bottom: 0
          }
          .active-hash{
          background-color: #fff;
          }
          #js_panel_guide a[mode-tab="offline"] {
            display: none;
          }
        `)
      }
      // 添加 返回离线界面 按钮
      const returnOfflineButton = () => {       
        $leftTvf.append(`
          <a class="button btn-line return-offline" href="javascript:;">
            <span style="margin-right: 5px;font-size: 16px">🚀</span>
            <span>返回离线界面</span>
          </a>
        `).on('click', '.return-offline', () => {
          win.location.href = this.Link.offlineUI
        })
      }
      // 添加 返回云下载界面 按钮
      const returnCloudFiles = () => {   
        $leftTvf.append(`
          <a class="button btn-line return-offline" href="javascript:;">
            <span style="margin-right: 5px;font-size: 16px">📁</span>
            <span>返回云下载文件</span>
          </a>
        `).on('click', '.return-offline', () => {
          win.location.href = this.Link.filesUI
        })
      }

      // 将离线按钮放出来，115隐藏那么深干吗
      const offlineTaskButton = () => {
        $leftTvf.append(`
          <a href="javascript:;" class="button btn-stroke btn-upload" menu="offline_task">
            <span style="margin-right: 5px;font-size: 16px">✔️</span>
            <span>添加离线任务</span>
            <em style="display:none;" class="num-dot"></em>
          </a>
        `)
      }

      if(!win.location.href.includes('325469714140895815')) {
        returnCloudFiles()
      }

      if(win.location.href === this.Link.offlineUI) {
        reloadOfflineButton()
      } else {
        returnOfflineButton()      
      }

      offlineTaskButton()
    }

    loading($dom, bool = true) {
      let $spinner = $dom.find('.hook115-spinner')
      if(bool) {
        $spinner.removeClass('hide')
      } else {
        $spinner.addClass('hide')
      }
      if($spinner.length) {
        return 
      }
      $dom.css({position: 'relative'}).append(`
        <div class="hook115-spinner">
          <svg>
            <circle cx="15" cy="15" r="13"></circle>
          </svg>
        </div>
      `)
      GM_addStyle(`
      .hook115-spinner.hide{
        display: none;
      }
      .hook115-spinner{
        z-index: 999;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background:rgb(255 255 255 / .4);
      }      
      .hook115-spinner svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: block;
        margin: 20px auto 0;
        width: 30px;
        height: 30px;
        x: 0;
        y: 0;
        viewBox: 0 0 30 30;
      }      
      .hook115-spinner svg circle {
        fill: transparent;
        stroke: #2878f8;
        stroke-width: 4;
        stroke-linecap: round;
        stroke-dasharray: 94.2px;
        transform-origin: 15px 15px 0;
        animation: spinner 2s linear infinite
      }      
      @keyframes spinner {
        0% {
          transform: rotate(0);
          stroke-dashoffset: 19.8
        }      
        50% {
          transform: rotate(720deg);
          stroke-dashoffset: 94.2
        }      
        100% {
          transform: rotate(1080deg);
          stroke-dashoffset: 19.8
        }
      }
      `)
    }

    sleep(time) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(time);
        }, time);
      });
    }

    // 在删除离线任务，自动选中删除源文件
    async autoCheckDelSourceFile(win) {
      let self = this
      $('#js-warp').on("click", "[task_popup]", async function() {
        let s = $(this), c = s.attr("task_popup");
        if(c === 'del') {
          await self.sleep(200)
          win.$("#js_del_task_source").prop("checked", true)
        }
      })
    }

    // 检测DOM节点变化
    listenNode(node, callback) {
      const targetNode = document.querySelector(node);

      const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            console.log('子节点有变化');
            callback()
          } else if (mutation.type === 'attributes') {
            console.log('属性有变化');
          }
        }
      });
      
      const config = {
        attributes: false,
        childList: true,
        subtree: false,
      };
      
      observer.observe(targetNode, config);
    }

    // 给不同下载状态的任务分类
    async classifyTasks() {
      GM_addStyle(`
        #js-warp > li{
          display:none
        }
        .left-tvf fieldset {        
          display: flex;
          justify-content: center;          
          height: 30px;
          padding: 0;
          font-size: 12px;
          padding: 0 12px;
        }
        .left-tvf fieldset > div{
          display: flex;
          align-items: center;
          margin: 0 5px;
        }
        .left-tvf fieldset > div input{
          margin-right: 3px;
          cursor: pointer;
        }
        .left-tvf fieldset > div label{          
          cursor: pointer;
        }
      `)
      let $warp115 = $('#js-warp')
      let $leftTvf = $('#js_top_panel_box .left-tvf')
      $leftTvf.append(`
        <fieldset class="button btn-line">
          <div>
            <input type="checkbox" id="offlineFail" name="offline-classify" value="-1" />
            <label for="offlineFail">失败</label>
          </div>
          <div>
            <input type="checkbox" id="offlinePening" name="offline-classify" value="1" />
            <label for="offlinePening">下载中</label>
          </div>
          <div>
            <input type="checkbox" id="offlineAllocating" name="offline-classify" value="0" />
            <label for="offlineAllocating">分配中</label>
          </div>
          <div>
            <input type="checkbox" id="offlineSuccess" name="offline-classify" value="2" />
            <label for="offlineSuccess">下载成功</label>
          </div>
        </fieldset>
      `)

      this.loading($warp115.parent())

      const getClassifyInitValue = () => {
        try {
          return JSON.parse(localStorage.getItem('classifyValue')) ?? ['2']
        } catch (error) {
          return ['2']
        }
      }
      
      // 初始化选中
      const initCheck = () => {
        $leftTvf.find('input[type="checkbox"]').each((index, ele) => {
          if(getClassifyInitValue().includes(ele.value)) {
            ele.checked = true
          }
        })
      }
      // 获取选中的值
      const getCheckClassify = () => {
        return Array.from($leftTvf.find('input[type="checkbox"]'))
        .filter(item => item.checked)
        .map(item => item.value)
      }
      // 根据选中的值操作显示
      const handleClassify = () => {
        let classifyValue = getCheckClassify()
        $warp115.find('li').each((index, ele) => {
          let status = ele.getAttribute('status')
          if(!classifyValue.length) {
            return ele.style.display = 'flex'
          }
          if(classifyValue.includes(status)) {
            ele.style.display = 'flex'
          } else {
            ele.style.display = 'none'
          }
        })
        // 如何没有选中成功的2，就隐藏翻页
        let $jsPage = $('#js-page')
        if(classifyValue.includes('2') || !classifyValue.length) {
          $jsPage.show()
        } else {
          $jsPage.hide()
        }
      }
      
      $leftTvf.on('change', 'fieldset', (event) => {
        // console.log(event.target, 'fieldset change event...');
        handleClassify()
        localStorage.setItem('classifyValue', JSON.stringify(getCheckClassify()))
      })
      // await this.sleep(2000)
      this.listenNode('#js-warp', () => {
        if($warp115.find('li').length) {
          this.loading($warp115.parent(), false)
          initCheck()
          handleClassify()
        }
      })
      
    }

    request(url, data, method = "GET", options = {}) {
      method = method ? method.toUpperCase().trim() : "GET";
      if (!url || !["GET", "HEAD", "POST"].includes(method)) return;
    
      if (Object.prototype.toString.call(data) === "[object Object]") {
        data = Object.keys(data)
          .map(key => `${key}=${encodeURIComponent(data[key])}`)
          .join("&");
      }
      const { responseType, headers = {} } = options;
      if (method === "GET") {
        options.responseType = responseType ?? "document";
        if (data) {
          let joiner = "?";
          if (url.includes(joiner)) joiner = /\?|&$/.test(url) ? "" : "&";
          url = `${url}${joiner}${data}`;
        }
      }
      if (method === "POST") {
        options.responseType = responseType ?? "json";
        options.headers = { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", ...headers };
      }
      return new Promise(resolve => {
        GM_xmlhttpRequest({
          url,
          data,
          method,
          timeout: 30000,
          onload: ({ status, response }) => {
            if (status >= 400) response = false;
            if (response && ["", "text"].includes(options.responseType)) {
              if (/<\/?[a-z][\s\S]*>/i.test(response)) {
                response = new DOMParser().parseFromString(response, "text/html");
              } else if (/^\{.*\}$/.test(response)) {
                response = JSON.parse(response);
              }
            }
            resolve(response ?? true);
          },
          ontimeout: () => resolve(false),
          onerror: () => resolve(false),
          ...options,
        });
      });
    }
    // 获取sign和time
    async driveSign() {
      const res = await this.request(
          "http://115.com/",
          { ct: "offline", ac: "space", _: new Date().getTime() },
          "GET",
          {
              responseType: "json",
          }
      );
      if (res?.state) return { sign: res.sign, time: res.time };
    }

    formatFileSize(size) {
      if (size === 0) return '0 B';
      const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
      const k = 1024;
      const i = Math.floor(Math.log(size) / Math.log(k));
      const fileSize = parseFloat((size / Math.pow(k, i)).toFixed(2));
      return `${fileSize} ${units[i]}`;
    }

    listenAjax(url, callback) {
      // return new Promise((resolve, reject) => {});
        $(document).ajaxComplete((event, xhr, settings) => {
          // console.log({event, xhr, settings}, settings.url, 'listenAjax')     
          if(settings.url === url){            
            callback({event, xhr, settings});
          }
        })
    }
    // 磁力已经存在，找到是那个磁力
    findMagnet(win) {

      GM_addStyle(`
      .magnet-info {
        min-height: 370px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .magnet-info table{
        font-size: 16px;
        text-align: left;
      }
      .magnet-info table td {
        padding: 8px 10px;
        border: 1px solid #d4d4d4;
      }
      .magnet-info a:hover {
        text-decoration: underline !important;
      }
      .swal2-modal .swal2-title{
        font-size: 1.5em
      }
      .count-query-btn{
        margin: 5px 0
      }
      .count-query-btn a{
        color: #2777F8
      }
      `)
      // let current = { task: null }
      const iframeWin = document.querySelector('#js_center_main_box [name="wangpan"]').contentWindow
      // 查询任务列表
      const queryTasks = (data, interval, page_count = 1) => {
        const { sign, time, uid } = win.Core.OFFL5Plug.GetDataCtl()._set_sign()
        return new Promise(async (resolve, reject) => {
          const reloadStatusBtn = document.querySelector('#mod115Handle .reload-status')
          const $magnetHtml = $('#magnetHtml')
          const loadingText = `
            <p>正在从离线列表中查找链接相关的数据</p>
            <p>page_count: ${page_count}, ⌛️ Loading...</p>
          `
          if(reloadStatusBtn) {
            reloadStatusBtn.textContent = 'Loading'
          }
          $magnetHtml.html(loadingText)
          // this.loading($('#magnetHtml'))          
          
          const res = await this.request(
            'https://115.com/web/lixian/?ct=lixian&ac=task_lists',
            {
              page: page_count,
              uid, sign, time
            },
            'POST'
          )
          if(res.state) {
            const failText = next => {
              const failTips = `在离线列表的前 ${page_count} 页内都查找不到当前的链接数据`
              const linksCount = iframeWin.$('.page-links > a').eq(-2)
              $magnetHtml
              .html(`
                <p>${failTips}</p>
                <p>🔻</p>
                <p style="font-size: 16px">${data.url}</p>
              `)
              if(next) {
                $magnetHtml.append(
                  `<p class="count-query-btn"><a href="javascript:;" title="以降低速率的形式, 继续找剩余的所有离线记录，共计${linksCount.text()}页，${parseInt(linksCount.attr('start')) + 30}个链接">🔄继续查找</a><p/>`
                )
              }
            }
            if(!res.tasks) {
              failText()
              bindEvent(data)
              return reject(res.tasks)
            }
            let task = res.tasks.find(item => {
              return item.info_hash === data.info_hash ||
                      encodeURI(item.name) === encodeURI(data.name) || 
                      encodeURI(item.url) === encodeURI(data.url)
            })
            console.log(res.tasks, task, 'task123');
            // const task = res.tasks.find(item => item.info_hash === data.info_hash)
            // 如果还在查找数据的过程中
            let isLoop = (interval || page_count > 1) && !task;
            bindEvent(data, task, isLoop)

            const countQuery = (sleep) => {
              new Promise(async (resolve2, reject2) => {        
                await queryTasks(data, 0, page_count)
                .catch(async tasks => {
                  // 取到了数据，或者永远取不到数据了就停止翻页
                  if(task || !tasks) {
                    return false
                  }
                  if(sleep) {
                    page_count += 1
                    await this.sleep(2000)
                    await countQuery(true)
                  }
                })
              })
            }
            if(!task && page_count < 3) {
              page_count += 1
              return await countQuery()
            }
            if(!task && !$magnetHtml.data('loading')) {
              failText(true)
              $magnetHtml.find('.count-query-btn').on('click', 'a', async function() {
                $magnetHtml.data('loading', true).html(loadingText)
                return await countQuery(true)
              })
            }
            if(!task) {
              return reject(res.tasks)
            }
            let needResult = ['name', 'url', 'add_time', 'last_update', 'file_id', 'size', 'percentDone', 'status']
  
            let domList = Object.entries(task)
            .filter(item => item[1] !== '')
            .filter(item => needResult.includes(item[0]))
            .map(item => {
              if(item[0] === 'add_time' || item[0] === 'last_update') {
                item[1] = new Date(item[1] * 1000).toLocaleString()
              }
              if(item[0] === 'file_id') {
                item[1] = `<a target="_blank" href="https://115.com/?cid=${item[1]}&mode=wangpan">${item[1]}</a>`
              }
              if(item[0] === 'size') {
                item[1] = this.formatFileSize(item[1])
              }
              if(item[0] === 'percentDone') {
                item[1] = `${item[1].toFixed(2)} %`
              }
              if(item[0] === 'status') {
                switch (item[1]) {
                  case 2:
                    item[1] = `<span style="color: rgb(61, 230, 255)">下载成功</span>`
                    break;
                  case 1:
                    item[1] = `<span style="color: rgb(6, 72, 179)">下载中</span>`
                    break;
                  case 0:
                    item[1] = `<span style="color: rgb(207, 203, 197)">正在分配服务器</span>`
                    break;
                  case -1:
                    item[1] = `<span style="color: rgb(255, 84, 50)">下载失败</span>`
                  default:
                    break;
                }
              }                
              return `<tr>
                <td><strong style="white-space: nowrap">${item[0]}</strong></td>
                <td>${item[1]}</td>
              </tr>`
            })

            domList.push(`
              <tr>
                <td><strong>page_count</strong></td>
                <td>${page_count}</td>
              </tr>
            `)
            $magnetHtml.html(`<table>${domList.join('')}</table>`)
            if(reloadStatusBtn) {
              reloadStatusBtn.textContent = '刷新状态'
            }
            // this.loading($('#magnetHtml'), false)
            resolve(task)
            
            // 间隔3秒再自动刷新6次
            if(interval) {
              interval -= 1
              await this.sleep(10000)
              queryTasks(data, interval)
              // .then(task => {
              //   bindEvent(data, task)
              // })
            }  
          } else {
            alert('115返回数据异常，刷新页面后重试')
            win.location.reload()
          }
        })
      }
      // 绑定事件操作
      const bindEvent = (data, task = {}, isLoop = false) => {
        const { sign, time, uid } = win.Core.OFFL5Plug.GetDataCtl()._set_sign()
        const handle = '#mod115Handle', $handle = $(handle)
        const { file_id, info_hash, name } = task

        if($handle.find('.reload-status').length === 0 && data.errcode === 0) {
          $handle.append(`
          <button type="button" class="reload-status swal2-confirm swal2-styled" style="background-color: #2778c4">刷新状态</button>
          `)
        }
        if($handle.find('.open-dir').length === 0 && file_id) {
          $handle.append(`           
          <button type="button" class="open-dir swal2-confirm swal2-styled">打开目录</button>
          `)
        }
        if($handle.find('.del-download').length === 0 && info_hash) {
          $handle.append(`           
          <button type="button" class="del-download swal2-deny swal2-styled">删除</button>
          `)
        }
        if($handle.find('.close-mod115').length === 0) {
          $handle.append('<button type="button" class="close-mod115 swal2-cancel swal2-styled">关闭</button>')
        }
        
        $(document).off('click', handle);
        $(document).on('click', handle, async event => {
          const cl = event.target.classList

          if(cl.contains('reload-status')) {
            queryTasks(data)
            // .then(task => {
            //   bindEvent(data, task)
            // })
          }
          if(cl.contains('close-mod115')) {
            if(isLoop) {
              return win.location.reload()
            }
            Swal.clickCancel()
          }
          if(cl.contains('open-dir') && file_id) {
            GM_openInTab(`https://115.com/?cid=${file_id}&mode=wangpan`, false)
          }
          if(cl.contains('del-download') && info_hash) {
            let delDownBtn = document.querySelector(`${handle} .del-download`)
            if(delDownBtn) {
              delDownBtn.textContent = 'Loading'
            }
            const res = await this.request('https://115.com/web/lixian/?ct=lixian&ac=task_del', {
              'hash[0]': info_hash,
              flag: 1,
              uid, sign, time
            }, 'POST')
            if(res.state) {          
              Swal.fire({
                toast: true,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                title: `${name} 删除成功`,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              win.Core.OFFL5Plug.Reload()
              if(delDownBtn) {
                delDownBtn.textContent = '删除'
              }
            }
          }
        })
      }
      
      const add_task_url = '/web/lixian/?ct=lixian&ac=add_task_url';
      // let task_lists = '/web/lixian/?ct=lixian&ac=task_lists';
      this.listenAjax(add_task_url, ({event, xhr, settings}) => {
        console.log(settings.url, 'b123');
        let data = JSON.parse(xhr.responseText)
        // let files = data.files ?? ''

        // 离线下载的状态
        let status = {icon: 'info', msg: data.error_msg}
        switch (data.errcode) {
          case 10008:
            status = {icon: 'info', msg: data.error_msg}
            break;
          case 0:
            status = {icon: 'success', msg: '离线任务添加成功'}
          default:
            break;
        }
        // 弹窗
        if(data.errcode === 10008 || data.errcode === 0) {
          $('.dialog-handle > .close').trigger('click');

          Swal.fire({
            title: status.msg,
            html: `<div class="magnet-info">
              <div id="magnetHtml">Loading...</div>
            </div>`,
            showConfirmButton: false,
            icon: status.icon,
            heightAuto: false,
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            width: '710px',
            allowOutsideClick: false,
            allowEnterKey: false,
            footer: `<div style="display: flex;justify-content: center;" id="mod115Handle"></div>`
          })
        }
        // 查询数据
        queryTasks(data, data.errcode === 0 ? 3 : 0)
      })
    }

    
  }

  new mod115();


})();