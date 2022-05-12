var _pcreatorConfig;

_pcreatorConfig = _pcreatorConfig || {};

_pcreatorConfig = {
appCode: "53b2fb6499122d4f326aa853b1ca6455a5e674d5",
baseUrl: "//print.kintoneapp.com",
sheets: JSON.parse('\u005B\u007B\u0022id\u0022\u003A261262,\u0022title\u0022\u003A\u0022\\u8acb\\u6c42\\u66f8\u0022,\u0022sheetType\u0022\u003A\u0022single\u0022,\u0022isDisplay\u0022\u003Atrue\u007D\u005D'),
useAutoSave: true,
useTableCondition: false,
tableCondition: JSON.parse('\u005B\u007B\u0022label\u0022\u003A\u0022\u0022,\u0022conditions\u0022\u003A\u005B\u007B\u0022start\u0022\u003A0,\u0022end\u0022\u003A1\u007D\u005D\u007D\u005D'),
useLayoutInitialSelect: false,
layoutInitialSelect: JSON.parse('\u005B\u007B\u0022expectedValue\u0022\u003A\u0022\u0022,\u0022target\u0022\u003A\u005B\u005D\u007D\u005D'),
downloadedAt: "2022-01-07 16:44:39+09:00"
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
