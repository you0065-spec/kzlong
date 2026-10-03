/* 科中龙官网 — 交互脚本 */
(function () {
  "use strict";

  // 移动端导航开关
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.innerHTML = open ? "✕" : "☰";
    });
    // 点击导航项后在窄屏自动收起
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = "☰";
      }
    });
  }

  // 页脚年份自动更新
  var year = document.querySelector(".js-year");
  if (year) year.textContent = new Date().getFullYear();

  // 联系表单：纯前端演示提交（未接后端），给出状态反馈
  var form = document.querySelector(".js-contact-form");
  if (form) {
    var notice = form.querySelector(".js-form-notice");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      if (notice) notice.textContent = "已收到，我们会在 1 个工作日内联系你（当前为前端演示，未接入后端）。";
      if (btn) btn.disabled = false;
    });
  }
})();