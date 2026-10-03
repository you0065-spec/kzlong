/* 科中龙官网 — 多语言自动识别与切换记忆
   逻辑：
   1. 首次访问（从未手动切换过）：浏览器首选语言非中文 → 自动进入英文版；
   2. 手动点击语言切换（data-manual）→ 写入 localStorage，此后严格按用户偏好双向跳转；
   3. 所有跳转使用相对地址，根域名（kzlgd.de5.net）与子路径（xxx.github.io/kzlong）部署均兼容。
   页面约定：中文页在站点根，英文页在 en/ 下同名文件。 */
(function () {
  "use strict";

  var KEY = "kzlang";            // 语言偏好
  var MANUAL = "kzlang_manual";  // 是否手动设置过

  function isChinese(str) {
    return /^zh\b/i.test(str || "");
  }

  // 当前页是否英文页（路径含 /en/）
  function onEnglishPage() {
    return /\/en\/([a-z]+\.html)?(\?.*)?(#.*)?$/i.test(location.pathname) ||
           /\/en$/i.test(location.pathname);
  }

  // 中文页 → 英文页（相对路径）：/xxx.html → en/xxx.html；目录页 → en/
  function relativeEnUrl() {
    var segs = location.pathname.split("/").filter(Boolean);
    var last = segs.length ? segs[segs.length - 1] : "";
    return /\.html$/i.test(last) ? "en/" + last : "en/";
  }

  // 英文页 → 中文页（相对路径）：en/xxx.html → ../xxx.html；en/ → ../
  function relativeZhUrl() {
    var segs = location.pathname.split("/").filter(Boolean);
    var last = segs.length ? segs[segs.length - 1] : "";
    return /\.html$/i.test(last) ? "../" + last : "../";
  }

  function store(val) {
    try {
      localStorage.setItem(KEY, val);
      localStorage.setItem(MANUAL, "1");
    } catch (err) { /* 隐私模式下忽略 */ }
  }

  // 手动切换：链接带 data-manual="en" 或 "zh"
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-manual]");
    if (!a) return;
    store(a.getAttribute("data-manual") === "en" ? "en" : "zh");
  });

  (function route() {
    var pref = null;
    try { pref = localStorage.getItem(KEY); } catch (err) { /* 忽略 */ }

    // 已手动选择过：按偏好双向跳转
    if (pref === "en" && !onEnglishPage()) {
      location.replace(relativeEnUrl() + location.search + location.hash);
      return;
    }
    if (pref === "zh" && onEnglishPage()) {
      location.replace(relativeZhUrl() + location.search + location.hash);
      return;
    }
    if (pref !== null) return; // 偏好与当前页一致，不动作

    // 首次访问：已在英文页则不跳；浏览器首选语言非中文 → 进英文版
    if (onEnglishPage()) return;

    var nav = navigator;
    var langs = (nav.languages && nav.languages.length)
      ? nav.languages
      : [nav.language || nav.userLanguage || ""];
    var preferChinese = isChinese(langs[0]);

    if (!preferChinese) {
      location.replace(relativeEnUrl() + location.search + location.hash);
    }
  })();
})();