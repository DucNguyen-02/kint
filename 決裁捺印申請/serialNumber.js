/*
 * 自動採番のサンプルプログラム
 * Copyright (c) 2015 Cybozu
 *
 * Licensed under the MIT License
 */

(function() {

    "use strict";
    // 自動枝番の処理（新規登録時のみ実行）
    kintone.events.on('app.record.detail.process.proceed', function(event) {
        var record = event.record;
        var nStatus = event.nextStatus.value
        if (nStatus == '一次承認申請中' && record.立案No.value == "") {
            serial_number(event);
        }
        return event;
    });

    function serial_number(event) {
        var recNo = 1;
        var record = event.record;
        //登録日付を入力
        var createDate = moment();
        var customerCodeFd = record['部署ID']['value'];
        var queryStr = '部署ID = "' + customerCodeFd +  '"order by 立案No desc limit 1&fields[0]=立案No'
        var appUrl = kintone.api.url('/k/v1/records', true) +
        '?app=' + kintone.app.getId() + '&query=' + encodeURI(queryStr);
   
        var xmlHttp = new XMLHttpRequest();

        // 同期リクエストを行う
        xmlHttp.open("GET", appUrl, false);
        xmlHttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xmlHttp.send(null);
  
        if (xmlHttp.status === 200) {
            if (window.JSON) {
                var obj = JSON.parse(xmlHttp.responseText);
                if (obj.records.length > 0) {
                    try {
                        //recNo = parseInt(obj.records[0]['取引先コード'].value, 10);
                        recNo = parseInt((obj.records[0]['立案No'].value).slice(-3)) + 1;
                        if (!recNo) {
                            recNo = 0
                        }
                    } catch(e) {
                        event.error = '立案Noコードが取得できません。';
                    }
                }
                  if (recNo <= 999) {
                    //自動採番を見積番号に設定する
                    var autoEstNo = customerCodeFd + String(('000' + recNo).slice(-3));
                    alert("立案No " + autoEstNo + " を登録します。");
                    record['立案No']['value'] = autoEstNo;
                  } else {
                    event.error = customerCodeFd + 'の枝番の上限に達しています。'
                  }
            } else {
                event.error = xmlHttp.statusText;
            }
        } else {
            record['立案No'].error = '立案Noが取得できません。';
        }
        return event;
    }
  })();