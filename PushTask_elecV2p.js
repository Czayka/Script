const $ = new Env('elecV2P')
const v2purl = $.getval('v2purl');
const v2ptoken = $.getval('v2token');
$.jdupdateButton = $.getdata("jdtaskupdate") ? $.getdata("jdtaskupdate") === "true" : false;
$.v2ptaskupdate = $.getdata("v2ptaskupdate") ? $.getdata("v2ptaskupdate") === "true" : false;
let v2pblackList = $.getjson('v2pblacklist', "");
let tz = "";
//++++++++++++++++++++++++++++++++++++++++
$.KEY_usercfgs = 'chavy_boxjs_userCfgs'
$.KEY_sessions = 'chavy_boxjs_sessions'
$.KEY_web_cache = 'chavy_boxjs_web_cache'
$.KEY_app_subCaches = 'chavy_boxjs_app_subCaches'
$.KEY_globalBaks = 'chavy_boxjs_globalBaks'
$.KEY_backups = 'chavy_boxjs_backups'
$.KEY_cursessions = 'chavy_boxjs_cur_sessions'
  //++++++++++++++++++++++++++++++++++++++++
  !(async () => {
    console.log("\n* Author:CenBoMin\n* Github:github.com/CenBoMin/GithubSync\n* Telegram:https://t.me/CbScript\n* Updatetime:2021.06.20\n");
    console.log(`Now login(UTC+8):${new Date(new Date().getTime()).toLocaleString()}`)
    //++++++++++++++++++++++++++++++++++++++++
    if ($.v2ptaskupdate == false) {
      console.log(`\n🤖[${$.name}]:💲第一次执行初始化和检查错误❌`)
      console.log(`\n🧹[开始清除BoxJS缓存]`);
      await $.wait(1000)
      $.setjson({}, $.KEY_app_subCaches)
      $.setjson({}, $.KEY_web_cache)
      console.log(`→BoxJS缓存清除完毕👌`);
      console.log(`⚠️每次清除缓存会造成应用订阅错误,请到BOXJS更新全部订阅即可修复`);
      tz += ($.name, '', `⚠️每次清除缓存会造成应用订阅错误,请到BOXJS更新全部订阅即可修复`);
      //--------------------------------------
      console.log(`\n🔎[检查主页地址和WebhookToken]`);
      await $.wait(1000)
      if (!v2purl || !v2ptoken) {
        console.log(`→主页地址或WebhookToken不存在✖️\n‼️请先在BoxJS填入自己V2P服务器的主页地址和WebhookToken`);
      } else {
        console.log(`→BOXJS主页地址或WebhookToken存在👌`);
      }
      //--------------------------------------
      console.log(`\n🔎[检查主页地址格式]`);
      await $.wait(1000)
      if (v2purl.split("/")[3] === undefined) {
        console.log(`→BOXJS主页地址格式正确👌\n`);
      } else {
        console.log(`→BOXJS主页地址格式错误✖️\n‼️主页地址最后没有"/"\n🌰错误例子:http://198.1.1.4:1234/`);
      }

      console.log(`🗣请确认检查结果都为正确的时候,在到BOXJS订阅打开V2P上传任务开关！`);
      //++++++++++++++++++++++++++++++++++++++++
    } else {
      console.log(`\n🤖[${$.name}]:💲获取脚本执行需要的数据`)
      await getVersion();
      console.log(`→V2P服务器上的cookie列表`)
      await getKeyList();
      console.log(`→少年大佬的AllinOne任务订阅`)
      await getCronList();
      //++++++++++++++++++++++++++++++++++++++++
      console.log(`\n🤖[${$.name}]:💲开始格式化BOXJS数据`)
      const datas = {}
      const usercfgs = getUserCfgs()
      const sessions = getAppSessions()
      const curSessions = getCurSessions()
      const sysapps = getSystemApps()
      const syscfgs = getSystemCfgs()
      const appSubCaches = getAppSubCaches()
      const globalbaks = getGlobalBaks()
      sysapps.forEach((app) => Object.assign(datas, getAppDatas(app)))
      usercfgs.appsubs.forEach((sub) => {
        const subcache = appSubCaches[sub.url]
        if (subcache && subcache.apps && Array.isArray(subcache.apps)) {
          subcache.apps.forEach((app) => Object.assign(datas, getAppDatas(app)))
        }
      })
      //++++++++++++++++++++++++++++++++++++++++
      const box = {
        datas,
        usercfgs,
        sessions,
        curSessions,
        sysapps,
        syscfgs,
        appSubCaches,
        globalbaks
      }
      var taskListData = box.appSubCaches

      //预处理数据结构
      const taskListArr = new Array();
      let taskList = Object.keys(taskListData).map(key => taskListData[key].apps);
      for (let i = 0; i < taskList.length; i++) {
        let taskobj = taskList[i]
        for (let i = 0; i < taskobj.length; i++) {
          let taskJSUrl = taskobj[i].script
          if (taskobj[i].keys) {
            let taskJSKeyArr = taskobj[i].keys
            for (let i = 0; i < taskJSKeyArr.length; i++) {
              let taskJSKey = taskJSKeyArr[i]
              let taskListDataObj = {};
              taskListDataObj.Key = taskJSKey
              taskListDataObj.Url = taskJSUrl
              taskListArr.push(taskListDataObj);
            }
          }
        }
      }
      console.log(`→BOXJS格式化成功👏`)
      //++++++++++++++++++++++++++++++++++++++++ taskListArr
      console.log(`\n🤖[${$.name}]:💲初始化定时任务清单`)
      //核对v2p和boxjs的cookie，获取可能的定时url清单:key是数组,所以有很多重复的url
      const v2ptaskUrlArr = new Array();
      for (let i = 0; i < getKeyListdata.length; i++) {
        let checkKey = getKeyListdata[i]
        const taskurlV2P = taskListArr.filter(task => task.Key === `${checkKey}`)
        if (taskurlV2P[0] !== undefined) {
          v2ptaskUrlArr.push(taskurlV2P[0].Url);
        }
      }
      //数组去重
      let v2pformatUrlArr = unique(v2ptaskUrlArr)
      console.log(`→定时任务个数为:${v2pformatUrlArr.length}个`);

      //++++++++++++++++++++++++++++++++++++++++整合少年AllinOne京东订阅
      if ($.jdupdateButton == true) {
        console.log(`\n🤖[${$.name}]:💲检测到BOXJS开启京东上传任务`)
        for (let i = 0; i < allinoneList.length; i++) {
          let checkobj = allinoneList[i];
          if (checkobj.indexOf(`京东`) > -1) {
            let pushJDUrl = checkobj.replace(/https:\/\/ghproxy.com\//g, "").split(",")[0].replace(/https/, "&https").split("&")[1];
            v2pformatUrlArr.push(pushJDUrl);
          }
        };
        console.log(`→整合京东后定时任务个数为:${v2pformatUrlArr.length}个`);
      } else {
        console.log(`\n🤖[${$.name}]:💲检测到BOXJS关闭京东上传任务\n→跳过👇`)
      }

      //++++++++++++++++++++++++++++++++++++++++ v2pformatUrlArr
      console.log(`\n🤖[${$.name}]:💲获取V2P任务列表,删除已有任务`)
      //双数组比对删除V2P已有的定时任务
      await getV2PTask();
      let updateTaskUrlList = v2pformatUrlArr.filter(items => {
        if (!v2ptaskDataArr2.includes(items)) return items;
      })
      console.log(`→删除后定时任务个数为:${updateTaskUrlList.length}个`);
      await ArrindexOfDel(updateTaskUrlList, "github.com")

      //++++++++++++++++++++++++++++++++++++++++ updateTaskUrlList
      console.log(`\n🤖[${$.name}]:💲核对AllinOne订阅,生成黑名单`)
      const v2pUpdateObjArr = new Array();
      for (let i = 0; i < updateTaskUrlList.length; i++) {
        let checkUrl = updateTaskUrlList[i].match(/\w+\.js/g)[0]
        for (let i = 0; i < allinoneList.length; i++) {
          let checkobj = allinoneList[i];
          if (checkobj.indexOf(checkUrl) > -1) {
            v2pUpdateObjArr.push(checkobj);
          }
        }
      }
      let v2pUpdateObjArr2 = unique(v2pUpdateObjArr)
      console.log(`→黑名单定时任务个数为:${v2pUpdateObjArr2.length}个`);
      //++++++++++++++++++++++++++++++++++++++++
      if (v2pblackList == "") {
        $.setdata(JSON.stringify(v2pUpdateObjArr2, null, 2), 'v2pblacklist');
        console.log(`⚠️初始化黑名单已经存储到BOXJS\n需要上传的任务在v2p服务器手动添加!!`);
        tz += ($.name, '', `⚠️初始化黑名单已经存储到BOXJS\n需要上传的任务在v2p服务器手动添加!`);
        $.done();
      } else {
        //++++++++++++++++++++++++++++++++++++++++ v2pUpdateObjArr2
        console.log(`\n🤖[${$.name}]:💲排除黑名单上传定时任务删除`)
        let v2pblackList2 = $.getjson('v2pblacklist');

        let nowUpdateTaskArr = v2pUpdateObjArr2.filter(items => {
          if (!v2pblackList2.includes(items)) return items;
        })
        console.log(`→预备上传定时任务个数为:${nowUpdateTaskArr.length}个`);

        //++++++++++++++++++++++++++++++++++++++++
        if (nowUpdateTaskArr.length > 0 && $.v2ptaskupdate == true) {
          console.log(`\n🤖[${$.name}]:💲开始上传定时任务 🙆‍♀️`)
          for (let i = 0; i < nowUpdateTaskArr.length; i++) {
            V2PtaskName = nowUpdateTaskArr[i].split("tag=")[1].split(",")[0];
            V2PtaskCron = nowUpdateTaskArr[i].split("https")[0];
            V2PtaskUrl = nowUpdateTaskArr[i].split(",")[0].replace(/https/, "&https").split("&")[1];
            await pushtask();
            await $.wait(1000)
            await downloadJS();
            await v2pUpdateObjArr2.push(nowUpdateTaskArr[i])
            await $.setdata(JSON.stringify(v2pUpdateObjArr2, null, 2), 'v2pblacklist');
          }
        } else {
          console.log(`→没有定时任务需要上传🙅‍♀️`)
        }
      }
    }
    // if (tz) {
    //   await showmsg1();
    // }
  })().catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  }).finally(() => {
    $.done();
  })
//++++++++++++++++++++++++++++++++++++++++
async function showmsg1() {
    $.msg(`${$.name}任务执行通知🔔`, tz);
}
async function downloadJS() {
  return new Promise((resolve) => {
    let url = {
      url: `${v2purl}/webhook`,
      body: JSON.stringify({
        token: `${v2ptoken}`,
        type: 'download',
        op: 'put',
        url: V2PtaskUrl,
        dest: "./script/JSFile"
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'put'
    };
    $.post(url, async (err, resp, data) => {
      try {
        if (err) {
          console.log("⛔️API查询请求失败❌ ‼️‼️");
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          downloadinfo = resp.body
          $.log(`\n📥${resp.body}`);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
async function pushtask() {
  return new Promise((resolve) => {
    let url = {
      url: `${v2purl}/webhook`,
      body: JSON.stringify({
        token: `${v2ptoken}`,
        type: 'taskadd',
        op: 'put',
        task: {
          name: V2PtaskName,
          type: 'cron',
          job: {
            type: 'runjs',
            target: V2PtaskUrl,
          },
          time: V2PtaskCron,
          running: true
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'put'
    };
    $.post(url, async (err, resp, data) => {
      try {
        if (err) {
          console.log("⛔️API查询请求失败❌ ‼️‼️");
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          data = JSON.parse(data);
          const code = data.rescode
          switch (code) {
            case 0:
              console.log(`\n💡成功上传定时任务:${data.taskinfo.name}\n${data.taskinfo.time} ${data.taskinfo.job.target}`);
              $.msg($.name, `💡上传定时任务:${data.taskinfo.name}`);
              break;
            default:
              $.log(`\n‼️${resp.statusCode}[pushtask调试log]:${resp.body}`);

          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
async function getVersion() {
  return new Promise((resolve) => {
    const options = initTaskOptions("info");
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log("⛔️API查询请求失败，请检查自身设备网络情况");
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          if (safeGet(data)) {
            // $.log(data)
            data = JSON.parse(data);
            v2pversion = data.elecV2P.version
            const versionArr = v2pversion.split(".");
            const versionSum = (versionArr[0]*1) + (versionArr[1]*1)
            console.log(`→V2P服务器版本号:${v2pversion}`);
            if (versionSum < 6) {
              console.log(`⚠️V2P服务器版本号低于3.3.3,请先更新你的V2P版本`);
              tz += ($.name, '', `⚠️V2P服务器版本号低于3.3.3,请先更新你的V2P版本`);
              $.done();
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
async function getKeyList() {
  return new Promise((resolve) => {
    const options = initTaskOptions("store&op=all");
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log("⛔️API查询请求失败，请检查自身设备网络情况");
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          if (safeGet(data)) {
            // $.log(data)
            getKeyListdata = JSON.parse(data);
            //下载的data是一个cookie数组
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
async function getCronList() {
  return new Promise((resolve) => {
    const options = {
      // url: `https://cdn.jsdelivr.net/gh/shufflewzc/faker@main/qx.json`
      url: `https://raw.githubusercontent.com/Youthsongs/QuanX/master/task/AllinOne.json`
    };
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log("⛔️API查询请求失败，请检查自身设备网络情况");
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          if (safeGet(data)) {
            // $.log(data)
            console.log(data)
            data = JSON.parse(data);
            allinoneList = data.task
            console.log(JSON.stringify(allinoneList));
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
async function getV2PTask() {
  return new Promise((resolve) => {
    const options = initTaskOptions("task");
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log("⛔️API查询请求失败，请检查自身设备网络情况");
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          if (safeGet(data)) {
            // $.log(data)
            v2pTaskObj = JSON.parse(data);
            let v2pTaskArr = new Array();
            let v2ptaskDataArr = new Array();
            v2ptaskDataArr2 = new Array();
            for (let obj in v2pTaskObj) {
              v2pTaskArr.push(obj)
            }
            for (let i = 0; i < v2pTaskArr.length; i++) {
              let v2ptaskData = v2pTaskObj[v2pTaskArr[i]].job.target;
              v2ptaskDataArr.push(v2ptaskData)
            }
            for (let i = 0; i < v2ptaskDataArr.length; i++) {
              let v2ptaskData2 = v2ptaskDataArr[i].replace(/https:\/\/ghproxy.com\//g, "")
              v2ptaskDataArr2.push(v2ptaskData2)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}


//++++++++++++++++++++++++++++++++++++++++
function initTaskOptions(type) {
  return {
    url: `${v2purl}/webhook?token=${v2ptoken}&type=${type}`,
  };
}
//数组indexof删除元素
async function ArrindexOfDel(arr, val) {
  for (let i = 0; i < arr.length; i++) {
    let index = arr[i].indexOf(val)
    if (index > -1) {
      return arr.splice(i, 1)
    }
  }
};
//双数组去重
function distinct(a, b) {
  let arr = a.concat(b)
  let result = []
  let obj = {}

  for (let i of arr) {
    if (!obj[i]) {
      result.push(i)
      obj[i] = 1
    }
  }

  return result
}
//去重
function unique(arr) {
  return Array.from(new Set(arr))
}

function getSystemCfgs() {
  return {
    env: $.isShadowrocket() ? 'Shadowrocket' : $.isLoon() ? 'Loon' : $.isQuanX() ? 'QuanX' : $.isSurge() ? 'Surge' : 'Node',
    version: $.version,
    versionType: $.versionType,
    envs: [{
      id: 'Surge',
      icons: ['https://raw.githubusercontent.com/Orz-3/mini/none/surge.png', 'https://raw.githubusercontent.com/Orz-3/mini/master/Color/surge.png']
    }, {
      id: 'QuanX',
      icons: ['https://raw.githubusercontent.com/Orz-3/mini/none/quanX.png', 'https://raw.githubusercontent.com/Orz-3/mini/master/Color/quantumultx.png']
    }, {
      id: 'Loon',
      icons: ['https://raw.githubusercontent.com/Orz-3/mini/none/loon.png', 'https://raw.githubusercontent.com/Orz-3/mini/master/Color/loon.png']
    }, {
      id: 'Shadowrocket',
      icons: ['https://raw.githubusercontent.com/Orz-3/mini/master/Alpha/shadowrocket.png', 'https://raw.githubusercontent.com/Orz-3/mini/master/Color/shadowrocket.png']
    }],
    chavy: {
      id: 'ChavyLeung',
      icon: 'https://avatars3.githubusercontent.com/u/29748519',
      repo: 'https://github.com/chavyleung/scripts'
    },
    senku: {
      id: 'GideonSenku',
      icon: 'https://avatars1.githubusercontent.com/u/39037656',
      repo: 'https://github.com/GideonSenku'
    },
    id77: {
      id: 'id77',
      icon: 'https://avatars0.githubusercontent.com/u/9592236',
      repo: 'https://github.com/id77'
    },
    orz3: {
      id: 'Orz-3',
      icon: 'https://raw.githubusercontent.com/Orz-3/mini/master/Color/Orz-3.png',
      repo: 'https://github.com/Orz-3/'
    },
    boxjs: {
      id: 'BoxJs',
      show: false,
      icon: 'https://raw.githubusercontent.com/Orz-3/mini/master/Color/box.png',
      icons: ['https://raw.githubusercontent.com/Orz-3/mini/master/Alpha/box.png', 'https://raw.githubusercontent.com/Orz-3/mini/master/Color/box.png'],
      repo: 'https://github.com/chavyleung/scripts'
    },
    defaultIcons: ['https://raw.githubusercontent.com/Orz-3/mini/master/Alpha/appstore.png', 'https://raw.githubusercontent.com/Orz-3/mini/master/Color/appstore.png']
  }
}

function getSystemApps() {
  const sysapps = [{
    id: 'BoxSetting',
    name: '偏好设置',
    descs: ['可手动执行一些抹掉数据的脚本', '可设置明暗两种主题下的主色调', '可设置壁纸清单'],
    keys: ['@chavy_boxjs_userCfgs.httpapi', '@chavy_boxjs_userCfgs.bgimg', '@chavy_boxjs_userCfgs.http_backend', '@chavy_boxjs_userCfgs.color_dark_primary', '@chavy_boxjs_userCfgs.color_light_primary'],
    settings: [{
      id: '@chavy_boxjs_userCfgs.httpapis',
      name: 'HTTP-API (Surge)',
      val: '',
      type: 'textarea',
      placeholder: ',examplekey@127.0.0.1:6166',
      autoGrow: true,
      rows: 2,
      persistentHint: true,
      desc: '示例: ,examplekey@127.0.0.1:6166! 注意: 以逗号开头, 逗号分隔多个地址, 可加回车'
    }, {
      id: '@chavy_boxjs_userCfgs.httpapi_timeout',
      name: 'HTTP-API Timeout (Surge)',
      val: 20,
      type: 'number',
      persistentHint: true,
      desc: '如果脚本作者指定了超时时间, 会优先使用脚本指定的超时时间.'
    }, {
      id: '@chavy_boxjs_userCfgs.http_backend',
      name: 'HTTP Backend (Quantumult X)',
      val: '',
      type: 'text',
      placeholder: 'http://127.0.0.1:9999',
      persistentHint: true,
      desc: '示例: http://127.0.0.1:9999 ! 注意: 必须是以 http 开头的完整路径, 不能是 / 结尾'
    }, {
      id: '@chavy_boxjs_userCfgs.bgimgs',
      name: '背景图片清单',
      val: '无,\n跟随系统,跟随系统\nlight,http://api.btstu.cn/sjbz/zsy.php\ndark,https://uploadbeta.com/api/pictures/random\n妹子,http://api.btstu.cn/sjbz/zsy.php',
      type: 'textarea',
      placeholder: '无,{回车} 跟随系统,跟随系统{回车} light,图片地址{回车} dark,图片地址{回车} 妹子,图片地址',
      persistentHint: true,
      autoGrow: true,
      rows: 2,
      desc: '逗号分隔名字和链接, 回车分隔多个地址'
    }, {
      id: '@chavy_boxjs_userCfgs.bgimg',
      name: '背景图片',
      val: '',
      type: 'text',
      placeholder: 'http://api.btstu.cn/sjbz/zsy.php',
      persistentHint: true,
      desc: '输入背景图标的在线链接'
    }, {
      id: '@chavy_boxjs_userCfgs.changeBgImgEnterDefault',
      name: '手势进入壁纸模式默认背景图片',
      val: '',
      type: 'text',
      placeholder: '填写上面背景图片清单的值',
      persistentHint: true,
      desc: ''
    }, {
      id: '@chavy_boxjs_userCfgs.changeBgImgOutDefault',
      name: '手势退出壁纸模式默认背景图片',
      val: '',
      type: 'text',
      placeholder: '填写上面背景图片清单的值',
      persistentHint: true,
      desc: ''
    }, {
      id: '@chavy_boxjs_userCfgs.color_light_primary',
      name: '明亮色调',
      canvas: true,
      val: '#F7BB0E',
      type: 'colorpicker',
      desc: ''
    }, {
      id: '@chavy_boxjs_userCfgs.color_dark_primary',
      name: '暗黑色调',
      canvas: true,
      val: '#2196F3',
      type: 'colorpicker',
      desc: ''
    }],
    scripts: [{
      name: "抹掉：所有缓存",
      script: "https://raw.githubusercontent.com/chavyleung/scripts/master/box/scripts/boxjs.revert.caches.js"
    }, {
      name: "抹掉：收藏应用",
      script: "https://raw.githubusercontent.com/chavyleung/scripts/master/box/scripts/boxjs.revert.usercfgs.favapps.js"
    }, {
      name: "抹掉：用户偏好",
      script: "https://raw.githubusercontent.com/chavyleung/scripts/master/box/scripts/boxjs.revert.usercfgs.js"
    }, {
      name: "抹掉：所有会话",
      script: "https://raw.githubusercontent.com/chavyleung/scripts/master/box/scripts/boxjs.revert.usercfgs.sessions.js"
    }, {
      name: "抹掉：所有备份",
      script: "https://raw.githubusercontent.com/chavyleung/scripts/master/box/scripts/boxjs.revert.baks.js"
    }, {
      name: "抹掉：BoxJs (注意备份)",
      script: "https://raw.githubusercontent.com/chavyleung/scripts/master/box/scripts/boxjs.revert.boxjs.js"
    }],
    author: '@chavyleung',
    repo: 'https://github.com/chavyleung/scripts/blob/master/box/switcher/box.switcher.js',
    icons: ['https://raw.githubusercontent.com/chavyleung/scripts/master/box/icons/BoxSetting.mini.png', 'https://raw.githubusercontent.com/chavyleung/scripts/master/box/icons/BoxSetting.png']
  }, {
    id: 'BoxSwitcher',
    name: '会话切换',
    desc: '打开静默运行后, 切换会话将不再发出系统通知 \n注: 不影响日志记录',
    keys: [],
    settings: [{
      id: 'CFG_BoxSwitcher_isSilent',
      name: '静默运行',
      val: false,
      type: 'boolean',
      desc: '切换会话时不发出系统通知!'
    }],
    author: '@chavyleung',
    repo: 'https://github.com/chavyleung/scripts/blob/master/box/switcher/box.switcher.js',
    icons: ['https://raw.githubusercontent.com/chavyleung/scripts/master/box/icons/BoxSwitcher.mini.png', 'https://raw.githubusercontent.com/chavyleung/scripts/master/box/icons/BoxSwitcher.png'],
    script: 'https://raw.githubusercontent.com/chavyleung/scripts/master/box/switcher/box.switcher.js'
  }]
  return sysapps
}

function getUserCfgs() {
  const defcfgs = {
    favapps: [],
    appsubs: [],
    viewkeys: [],
    isPinedSearchBar: true,
    httpapi: 'examplekey@127.0.0.1:6166',
    http_backend: ''
  }
  const usercfgs = Object.assign(defcfgs, $.getjson($.KEY_usercfgs, {}))
  if (usercfgs.appsubs.includes(null)) {
    usercfgs.appsubs = usercfgs.appsubs.filter((sub) => sub)
    $.setjson(usercfgs, $.KEY_usercfgs)
  }
  return usercfgs
}

function getAppSubCaches() {
  return $.getjson($.KEY_app_subCaches, {})
}

function getGlobalBaks() {
  let backups = $.getjson($.KEY_backups, [])
  if (backups.includes(null)) {
    backups = backups.filter((bak) => bak)
    $.setjson(backups, $.KEY_backups)
  }
  return backups
}

function getVersions() {
  return $.http.get($.ver).then((resp) => {
    try {
      $.json = $.toObj(resp.body)
    } catch {
      $.json = {}
    }
  }, () => ($.json = {}))
}

function getUserApps() {
  return []
}

function getAppSessions() {
  return $.getjson($.KEY_sessions, [])
}

function getCurSessions() {
  return $.getjson($.KEY_cursessions, {})
}

function getAppDatas(app) {
  const datas = {}
  const nulls = [null, undefined, 'null', 'undefined']
  if (app.keys && Array.isArray(app.keys)) {
    app.keys.forEach((key) => {
      const val = $.getdata(key)
      datas[key] = nulls.includes(val) ? null : val
    })
  }
  if (app.settings && Array.isArray(app.settings)) {
    app.settings.forEach((setting) => {
      const key = setting.id
      const val = $.getdata(key)
      datas[key] = nulls.includes(val) ? null : val
    })
  }
  return datas
}
async function apiSave() {
  const data = $.toObj($request.body)
  if (Array.isArray(data)) {
    data.forEach((dat) => $.setdata(dat.val, dat.key))
  } else {
    $.setdata(data.val, data.key)
  }
  $.json = getBoxData()
}
async function apiAddAppSub() {
  const sub = $.toObj($request.body)
  const usercfgs = getUserCfgs()
  usercfgs.appsubs.push(sub)
  $.setjson(usercfgs, $.KEY_usercfgs)
  await reloadAppSubCache(sub.url)
  $.json = getBoxData()
}
async function apiReloadAppSub() {
  const sub = $.toObj($request.body)
  if (sub) {
    await reloadAppSubCache(sub.url)
  } else {
    await reloadAppSubCaches()
  }
  $.json = getBoxData()
}
async function apiDelGlobalBak() {
  const backup = $.toObj($request.body)
  const backups = $.getjson($.KEY_backups, [])
  const bakIdx = backups.findIndex((b) => b.id === backup.id)
  if (bakIdx > -1) {
    backups.splice(bakIdx, 1)
    $.setdata('', backup.id)
    $.setjson(backups, $.KEY_backups)
  }
  $.json = getBoxData()
}
async function apiUpdateGlobalBak() {
  const {
    id: backupId,
    name: backupName
  } = $.toObj($request.body)
  const backups = $.getjson($.KEY_backups, [])
  const backup = backups.find((b) => b.id === backupId)
  if (backup) {
    backup.name = backupName
    $.setjson(backups, $.KEY_backups)
  }
  $.json = getBoxData()
}
async function apiRevertGlobalBak() {
  const {
    id: bakcupId
  } = $.toObj($request.body)
  const backup = $.getjson(bakcupId)
  if (backup) {
    const {
      chavy_boxjs_sysCfgs,
      chavy_boxjs_sysApps,
      chavy_boxjs_sessions,
      chavy_boxjs_userCfgs,
      chavy_boxjs_cur_sessions,
      chavy_boxjs_app_subCaches,
      ...datas
    } = backup
    $.setdata(JSON.stringify(chavy_boxjs_sessions), $.KEY_sessions)
    $.setdata(JSON.stringify(chavy_boxjs_userCfgs), $.KEY_usercfgs)
    $.setdata(JSON.stringify(chavy_boxjs_cur_sessions), $.KEY_cursessions)
    $.setdata(JSON.stringify(chavy_boxjs_app_subCaches), $.KEY_app_subCaches)
    const isNull = (val) => [undefined, null, 'null', 'undefined', ''].includes(val)
    Object.keys(datas).forEach((datkey) => $.setdata(isNull(datas[datkey]) ? '' : `${datas[datkey]}`, datkey))
  }
  const boxdata = getBoxData()
  $.json = boxdata
}
async function apiSaveGlobalBak() {
  const backups = $.getjson($.KEY_backups, [])
  const boxdata = getBoxData()
  const backup = $.toObj($request.body)
  const backupData = {}
  backupData['chavy_boxjs_userCfgs'] = boxdata.usercfgs
  backupData['chavy_boxjs_sessions'] = boxdata.sessions
  backupData['chavy_boxjs_cur_sessions'] = boxdata.curSessions
  backupData['chavy_boxjs_app_subCaches'] = boxdata.appSubCaches
  Object.assign(backupData, boxdata.datas)
  backups.push(backup)
  $.setjson(backups, $.KEY_backups)
  $.setjson(backupData, backup.id)
  $.json = getBoxData()
}
async function apiImpGlobalBak() {
  const backups = $.getjson($.KEY_backups, [])
  const backup = $.toObj($request.body)
  const backupData = backup.bak
  delete backup.bak
  backups.push(backup)
  $.setjson(backups, $.KEY_backups)
  $.setjson(backupData, backup.id)
  $.json = getBoxData()
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`⛔️服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

function Env(t, e) {
  class s {
    constructor(t) {
      this.env = t
    }
    send(t, e = "GET") {
      t = "string" == typeof t ? {
        url: t
      } : t;
      let s = this.get;
      return "POST" === e && (s = this.post), new Promise((e, i) => {
        s.call(this, t, (t, s, r) => {
          t ? i(t) : e(s)
        })
      })
    }
    get(t) {
      return this.send.call(this.env, t)
    }
    post(t) {
      return this.send.call(this.env, t, "POST")
    }
  }
  return new class {
    constructor(t, e) {
      this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`)
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports
    }
    isQuanX() {
      return "undefined" != typeof $task
    }
    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon
    }
    isLoon() {
      return "undefined" != typeof $loon
    }
    isShadowrocket() {
      return "undefined" != typeof $rocket
    }
    toObj(t, e = null) {
      try {
        return JSON.parse(t)
      } catch {
        return e
      }
    }
    toStr(t, e = null) {
      try {
        return JSON.stringify(t)
      } catch {
        return e
      }
    }
    getjson(t, e) {
      let s = e;
      const i = this.getdata(t);
      if (i) try {
        s = JSON.parse(this.getdata(t))
      } catch {}
      return s
    }
    setjson(t, e) {
      try {
        return this.setdata(JSON.stringify(t), e)
      } catch {
        return !1
      }
    }
    getScript(t) {
      return new Promise(e => {
        this.get({
          url: t
        }, (t, s, i) => e(i))
      })
    }
    runScript(t, e) {
      return new Promise(s => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
        const [o, h] = i.split("@"), a = {
          url: `http://${h}/v1/scripting/evaluate`,
          body: {
            script_text: t,
            mock_type: "cron",
            timeout: r
          },
          headers: {
            "X-Key": o,
            Accept: "*/*"
          }
        };
        this.post(a, (t, e, i) => s(i))
      }).catch(t => this.logErr(t))
    }
    loaddata() {
      if (!this.isNode()) return {}; {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e);
        if (!s && !i) return {}; {
          const i = s ? t : e;
          try {
            return JSON.parse(this.fs.readFileSync(i))
          } catch (t) {
            return {}
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e),
          r = JSON.stringify(this.data);
        s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
      }
    }
    lodash_get(t, e, s) {
      const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;
      for (const t of i)
        if (r = Object(r)[t], void 0 === r) return s;
      return r
    }
    lodash_set(t, e, s) {
      return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
    }
    getdata(t) {
      let e = this.getval(t);
      if (/^@/.test(t)) {
        const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
        if (r) try {
          const t = JSON.parse(r);
          e = t ? this.lodash_get(t, i, "") : e
        } catch (t) {
          e = ""
        }
      }
      return e
    }
    setdata(t, e) {
      let s = !1;
      if (/^@/.test(e)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
        try {
          const e = JSON.parse(h);
          this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
        } catch (e) {
          const o = {};
          this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
        }
      } else s = this.setval(t, e);
      return s
    }
    getval(t) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
    }
    setval(t, e) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
    }
    initGotEnv(t) {
      this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
    }
    get(t, e = (() => {})) {
      t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.get(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
      })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
        hints: !1
      })), $task.fetch(t).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o)
      }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
        try {
          if (t.headers["set-cookie"]) {
            const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
          }
        } catch (t) {
          this.logErr(t)
        }
      }).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o)
      }, t => {
        const {
          message: s,
          response: i
        } = t;
        e(s, i, i && i.body)
      }))
    }
    post(t, e = (() => {})) {
      const s = t.method ? t.method.toLocaleLowerCase() : "post";
      if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient[s](t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
      });
      else if (this.isQuanX()) t.method = s, this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
        hints: !1
      })), $task.fetch(t).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o)
      }, t => e(t));
      else if (this.isNode()) {
        this.initGotEnv(t);
        const {
          url: i,
          ...r
        } = t;
        this.got[s](i, r).then(t => {
          const {
            statusCode: s,
            statusCode: i,
            headers: r,
            body: o
          } = t;
          e(null, {
            status: s,
            statusCode: i,
            headers: r,
            body: o
          }, o)
        }, t => {
          const {
            message: s,
            response: i
          } = t;
          e(s, i, i && i.body)
        })
      }
    }
    time(t, e = null) {
      const s = e ? new Date(e) : new Date;
      let i = {
        "M+": s.getMonth() + 1,
        "d+": s.getDate(),
        "H+": s.getHours(),
        "m+": s.getMinutes(),
        "s+": s.getSeconds(),
        "q+": Math.floor((s.getMonth() + 3) / 3),
        S: s.getMilliseconds()
      };
      /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
      return t
    }
    msg(e = t, s = "", i = "", r) {
      const o = t => {
        if (!t) return t;
        if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
          "open-url": t
        } : this.isSurge() ? {
          url: t
        } : void 0;
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let e = t.openUrl || t.url || t["open-url"],
              s = t.mediaUrl || t["media-url"];
            return {
              openUrl: e,
              mediaUrl: s
            }
          }
          if (this.isQuanX()) {
            let e = t["open-url"] || t.url || t.openUrl,
              s = t["media-url"] || t.mediaUrl;
            return {
              "open-url": e,
              "media-url": s
            }
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return {
              url: e
            }
          }
        }
      };
      if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
        let t = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
        t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
      }
    }
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
    }
    logErr(t, e) {
      const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t)
    }
    wait(t) {
      return new Promise(e => setTimeout(e, t))
    }
    done(t = {}) {
      const e = (new Date).getTime(),
        s = (e - this.startTime) / 1e3;
      this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
    }
  }(t, e)
}
