var _pcreatorConfig;

_pcreatorConfig = _pcreatorConfig || {};

_pcreatorConfig = {
appCode: "57a1e911f0d2bf0e73025c5beddac85071abf2c8",
baseUrl: "//print.kintoneapp.com",
sheets: JSON.parse('\u005B\u007B\u0022id\u0022\u003A166059,\u0022title\u0022\u003A\u0022\\u6c7a\\u88c1\\u30fb\\u637a\\u5370\\u4f9d\\u983c\\u66f8\u0022,\u0022sheetType\u0022\u003A\u0022single\u0022,\u0022isDisplay\u0022\u003Atrue\u007D\u005D'),
useAutoSave: true,
useTableCondition: false,
tableCondition: JSON.parse('\u005B\u007B\u0022label\u0022\u003A\u0022\u0022,\u0022conditions\u0022\u003A\u005B\u007B\u0022start\u0022\u003A0,\u0022end\u0022\u003A1\u007D\u005D\u007D\u005D')
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
})();
