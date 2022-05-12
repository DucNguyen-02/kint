var _pcreatorConfig;

_pcreatorConfig = _pcreatorConfig || {};

_pcreatorConfig = {
appCode: "2a885a0343b9decdda20f7b070b5daae5b2c524f",
baseUrl: "//print.kintoneapp.com",
sheets: JSON.parse('\u005B\u007B\u0022id\u0022\u003A258386,\u0022title\u0022\u003A\u0022\\u8acb\\u6c42\\u7ba1\\u7406v3\u0022,\u0022sheetType\u0022\u003A\u0022recordstbl\u0022,\u0022isDisplay\u0022\u003Atrue\u007D,\u007B\u0022id\u0022\u003A258218,\u0022title\u0022\u003A\u0022\\u8acb\\u6c42\\u7ba1\\u7406\u0022,\u0022sheetType\u0022\u003A\u0022recordstbl\u0022,\u0022isDisplay\u0022\u003Atrue\u007D,\u007B\u0022id\u0022\u003A237710,\u0022title\u0022\u003A\u0022\\u8acb\\u6c42\\u7ba1\\u7406v2\u0022,\u0022sheetType\u0022\u003A\u0022recordstbl\u0022,\u0022isDisplay\u0022\u003Atrue\u007D\u005D'),
useAutoSave: false,
useTableCondition: false,
tableCondition: JSON.parse('null'),
useLayoutInitialSelect: false,
layoutInitialSelect: JSON.parse('null'),
downloadedAt: "2021-12-21 12:20:39+09:00"
};

(function() {
  "use strict"
  var detailEvent = function (event) {
      var l, s, scr, styl;
      _pcreatorConfig.event = event;
      styl = document.createElement("link");
      styl.rel = "stylesheet";
      styl.type = "text/css";
      styl.href = "//print.kintoneapp.com/build/kintone-lib.min.css";
      l = document.getElementsByTagName("link")[0];
      l.parentNode.insertBefore(styl, l);
      scr = document.createElement("script");
      scr.type = "text/javascript";
      scr.async = true;
      scr.src = "//print.kintoneapp.com/build/kintone-lib.min.js";
      s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(scr, s);

      return event;
  };
  var indexEvent = function (event) {
      var l, s, scr, styl;
      _pcreatorConfig.event = event;
      styl = document.createElement("link");
      styl.rel = "stylesheet";
      styl.type = "text/css";
      styl.href = "//print.kintoneapp.com/build/kintone-lib.min.css";
      l = document.getElementsByTagName("link")[0];
      l.parentNode.insertBefore(styl, l);
      scr = document.createElement("script");
      scr.type = "text/javascript";
      scr.async = true;
      scr.src = "//print.kintoneapp.com/build/kintone-lib.min.js";
      s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(scr, s);

      return event;
  };

  kintone.events.on('app.record.detail.show', detailEvent);
  kintone.events.on('mobile.app.record.detail.show', detailEvent);
  kintone.events.on('app.record.index.show', indexEvent);
  kintone.events.on('mobile.app.record.index.show', indexEvent);
})();
